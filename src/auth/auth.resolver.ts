import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { RegistrationInput } from './dto/registration.input';
import { UseGuards, Req } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LocalAuthenticationGuard } from './guards/localAuthentication.guard';
import RequestWithUser from './common/requestWithUser.interface';

@Resolver(() => User)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation((returns) => User)
  @UseGuards(LocalAuthenticationGuard)
  async login(@Req() request: RequestWithUser): Promise<User> {
    const user = request.user;
    user.password = undefined;
    return user;
  }

  @Mutation((returns) => User)
  async register(@Args('registerInput') RegistrationInput: RegistrationInput) {
    return this.authService.register(RegistrationInput);
  }
}
