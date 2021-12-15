import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { Account } from '../auth/entities/auth.entity';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @ResolveField(() => Account)
  account(@Parent() user: User) {
    return this.userService.findUser(user.userId);
  }

  @Query(() => [User], { name: 'user' })
  list() {
    return this.userService.list();
  }

  @Query(() => User, { name: 'Account' })
  findById(@Args('id', { type: () => ID }) id: string) {
    return this.userService.findById(id);
  }

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removePUser(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }
}
