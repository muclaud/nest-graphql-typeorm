import {
  Injectable,
  BadRequestException,
  UnprocessableEntityException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import {
  ApiRequest,
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  TokenPayload,
  TokensType,
  getAccessTokenExpiresDate,
  getRefreshTokenExpiresDate,
} from './helpers/auth.types';
import { AccountStatus } from 'src/common/types';
import { Account } from './entities/auth.entity';
import { User } from 'src/users/entities/user.entity';
import { RegistrationInput } from './dto/registration.input';
import { ActivateInput } from './dto/activate.input';
import { LogInput } from './dto/login.input';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account) private accountRepo: Repository<Account>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  private createToken(payload: TokenPayload, expiresIn: string) {
    return this.jwtService.sign(payload, { expiresIn });
  }

  private setCookies(res: Response, tokens: TokensType) {
    res.cookie(ACCESS_TOKEN.key, tokens.accessToken, {
      expires: getAccessTokenExpiresDate(),
      httpOnly: true,
    });
    res.cookie(REFRESH_TOKEN.key, tokens.refreshToken, {
      expires: getRefreshTokenExpiresDate(),
      httpOnly: true,
    });
  }

  async createTokensAndSetCookies(account: Account, response: Response) {
    try {
      const payload: TokenPayload = {
        id: account.id,
        email: account.email,
        role: account.role,
      };
      const accessToken = this.createToken(payload, ACCESS_TOKEN.expiresIn);
      const refreshToken = this.createToken(payload, REFRESH_TOKEN.expiresIn);
      this.setCookies(response, { accessToken, refreshToken });
    } catch (error) {
      console.log(
        '🚀: AuthService -> createTokensAndSetCookies -> error',
        error.message,
      );
    }
  }

  verifyToken(token: string): TokenPayload {
    return this.jwtService.verify(token);
  }

  findByEmail(email: string): Promise<Account> {
    return this.accountRepo.findOne({ email });
  }

  async signup(userInput: RegistrationInput): Promise<string> {
    // check if a user with the given email is already exists
    const existedUser = await this.accountRepo.findOne({
      email: userInput.email,
    });
    if (existedUser) {
      throw new UnprocessableEntityException('email already exists!');
    }

    // hash account password and generate the verificationCode
    const hashedPassword = await bcrypt.hash(userInput.password, 12);
    const verificationCode = nanoid(10);
    // create and save the newUser entity
    let newAccount = this.accountRepo.create({
      email: userInput.email,
      password: hashedPassword,
      verificationCode,
      user: {
        firstName: userInput.firstName,
        lastName: userInput.lastName,
        birthDate: userInput.birthDate,
      },
    });
    newAccount = await this.accountRepo.save(newAccount);

    // send confirmation mail to the new account
    this.mailerService.sendMail({
      to: newAccount.email,
      subject: 'Welcome to Tech-Store App - Confirm your Email',
      html: `
        <h3>Hi ${newAccount.user.firstName} ${newAccount.user.lastName}</>
        <p>Please use the code below to confirm your email</p>
        <p>${verificationCode}</p>
        <p>Thanks</p>
      `,
    });

    // return the new account email
    return newAccount.email;
  }

  async activate(
    activateInput: ActivateInput,
    response: Response,
  ): Promise<Account> {
    // get the account by email
    let currentAccount = await this.accountRepo.findOne({
      email: activateInput.email,
    });
    // check account exist
    if (!currentAccount) {
      throw new BadRequestException('email not found!');
    }
    // check the verification code
    if (activateInput.verificationCode !== currentAccount.verificationCode) {
      throw new BadRequestException('wrong code!');
    }

    // activate the account
    currentAccount.status = AccountStatus.ACTIVE;
    currentAccount = await this.accountRepo.save(currentAccount);

    // then create tokens and set cookies
    await this.createTokensAndSetCookies(currentAccount, response);

    // finally return the account info
    return currentAccount;
  }

  async signin(signinInput: LogInput, response: Response): Promise<Account> {
    // check account email
    const currentAccount = await this.accountRepo.findOne({
      email: signinInput.email,
    });
    if (!currentAccount) {
      throw new BadRequestException('invalid credentials!');
    }

    // check account password
    const passwordMatch = await bcrypt.compare(
      signinInput.password,
      currentAccount.password,
    );
    if (!passwordMatch) {
      throw new BadRequestException('invalid credentials!');
    }

    // if both are ok then create tokens and set cookies
    await this.createTokensAndSetCookies(currentAccount, response);

    // finally return the account info
    return currentAccount;
  }

  async refresh(request: Request, response: Response): Promise<Account> {
    let currentAccount = (request as ApiRequest).currentUser;
    if (currentAccount) {
      return currentAccount;
    }

    if (request.cookies) {
      const refreshToken = request.cookies[REFRESH_TOKEN.key];
      console.log(
        '🚀: AuthService => refreshTokens -> refreshToken',
        refreshToken,
      );
      if (refreshToken) {
        try {
          const { email } = this.verifyToken(refreshToken) as TokenPayload;
          if (email) {
            currentAccount = await this.accountRepo.findOne({ email });
            this.createTokensAndSetCookies(currentAccount, response);
            return currentAccount;
          }
        } catch (error) {
          console.log(
            '🚀: AuthService => refreshTokens -> refreshTokenError',
            error,
          );
          throw new UnauthorizedException();
        }
      }
    }

    throw new UnauthorizedException();
  }

  signout(response: Response): string {
    response.clearCookie(ACCESS_TOKEN.key);
    response.clearCookie(REFRESH_TOKEN.key);
    return 'account logged out successfully';
  }

  currentAccount(account: Account): Account {
    if (account) return account;
    throw new UnauthorizedException();
  }

  async removeAccount(id: string) {
    const existedAccount = await this.accountRepo.findOne(id, {
      relations: ['user'],
    });
    if (!existedAccount) throw new NotFoundException('account not found');

    const deletedUser = {
      ...existedAccount,
      user: { ...existedAccount.user },
    };
    await this.userRepo.remove(existedAccount.user);
    await this.accountRepo.remove(existedAccount);
    return deletedUser;
  }

  findUser(accountId: string) {
    return this.userRepo.findOne({ accountId });
  }
}
