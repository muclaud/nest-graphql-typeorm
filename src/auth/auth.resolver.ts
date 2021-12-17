import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  Resolver,
  ResolveField,
  ID,
} from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Authorize } from './guards/auth.guard';
import { CurrentAccount } from './helpers/current-account.decorator';
import { Account } from './entities/auth.entity';
import { User } from '../users/entities/user.entity';
import { RegistrationInput } from './dto/registration.input';
import { ActivateInput } from './dto/activate.input';
import { LogInput } from './dto/login.input';

@Resolver(() => Account)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @ResolveField(() => User)
  account(@Parent() account: Account) {
    return this.authService.findUser(account.id);
  }

  @Mutation(() => String)
  signup(@Args('registrationInput') registrationInput: RegistrationInput) {
    return this.authService.signup(registrationInput);
  }

  @Mutation(() => Account)
  activateAccount(
    @Args('activateInput') input: ActivateInput,
    @Context() { res },
  ) {
    return this.authService.activate(input, res);
  }

  @Mutation(() => Account)
  signin(@Args('loginInput') logInput: LogInput, @Context() { res }) {
    return this.authService.signin(logInput, res);
  }

  @Mutation(() => Account)
  refreshAccount(@Context() { req, res }) {
    return this.authService.refresh(req, res);
  }

  @Authorize()
  @Mutation(() => String)
  signout(@Context() { res }) {
    return this.authService.signout(res);
  }

  @Authorize()
  @Query(() => Account)
  currentAccount(@CurrentAccount() account: Account) {
    return this.authService.currentAccount(account);
  }

  @Authorize()
  @Mutation(() => Account)
  removeAccount(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.authService.removeAccount(id);
  }
}
