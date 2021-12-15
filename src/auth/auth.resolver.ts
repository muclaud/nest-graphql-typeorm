import { Resolver, Context, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { RegistrationInput } from './dto/registration.input';
import { LogInput } from './dto/login.input';
import { UseGuards, Req } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import LocalAuthGuard from './guards/localAuth.guard';
import RequestWithUser from './common/requestWithUser.interface';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { GqlAuthGuard } from './guards/graphql-jwt-auth.guard';

@Resolver(() => User)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation((returns) => User)
  @UseGuards(GqlAuthGuard)
  async login(
    @Args('loginInput') LoginInput: LogInput,
    @Context() context: { request: RequestWithUser },
  ) {
    const user = await this.authService.getAuthenticatedUser(LoginInput);
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authService.getCookieWithJwtRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

    context.request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);

    return user;
  }

  @Mutation((returns) => Boolean)
  @UseGuards(LocalAuthGuard)
  @UseGuards(GqlAuthGuard)
  async logout(@Context() context: { request: RequestWithUser }) {
    await this.usersService.removeRefreshToken(context.request.user.id);
    context.request.res.setHeader(
      'Set-Cookie',
      this.authService.getCookieForLogOut(),
    );
  }

  @Mutation((returns) => User)
  async register(@Args('registerInput') RegistrationInput: RegistrationInput) {
    return this.authService.register(RegistrationInput);
  }

  @Query((returns) => User)
  @UseGuards(GqlAuthGuard)
  authenticate(@Context() context: { request: RequestWithUser }) {
    return context.request.user;
  }

  @Query((returns) => User)
  @UseGuards(GqlAuthGuard)
  @UseGuards(JwtRefreshGuard)
  refresh(@Context() context: { request: RequestWithUser }) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      context.request.user.id,
    );

    context.request.res.setHeader('Set-Cookie', accessTokenCookie);
    return context.request.user;
  }
}
