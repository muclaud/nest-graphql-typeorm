import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { RegistrationInput } from './dto/registration.input';
import { UseGuards, Req } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import LocalAuthGuard from './guards/localAuth.guard';
import RequestWithUser from './common/requestWithUser.interface';
import JwtAuthGuard from './guards/jwtAuth.guard';
import JwtRefreshGuard from './guards/jwt-refresh.guard';

@Resolver(() => User)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation((returns) => User)
  @UseGuards(LocalAuthGuard)
  async login(@Req() request: RequestWithUser) {
    const { user } = request;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authService.getCookieWithJwtRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);

    return user;
  }

  @Mutation((returns) => Boolean)
  @UseGuards(LocalAuthGuard)
  async logout(@Req() request: RequestWithUser) {
    await this.usersService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
  }

  @Mutation((returns) => User)
  async register(@Args('registerInput') RegistrationInput: RegistrationInput) {
    return this.authService.register(RegistrationInput);
  }

  @Query((returns) => User)
  @UseGuards(JwtAuthGuard)
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }

  @Query((returns) => User)
  @UseGuards(JwtRefreshGuard)
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user.id,
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
}
