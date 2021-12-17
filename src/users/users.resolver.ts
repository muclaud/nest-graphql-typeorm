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
import { Account } from 'src/auth/entities/auth.entity';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @ResolveField(() => Account)
  account(@Parent() user: User) {
    return this.userService.findUser(user.accountId);
  }

  @Query(() => [User], { name: 'getAllUsers' })
  list() {
    return this.userService.list();
  }

  @Query(() => User, { name: 'getUserById' })
  findById(@Args('id', { type: () => ID }) id: string) {
    return this.userService.findById(id);
  }

  @Mutation(() => User, { name: 'createUser' })
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Mutation(() => User, { name: 'updateUser' })
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User, { name: 'removeUser' })
  removeUser(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }

  @Mutation(() => User, { name: 'restorePost' })
  restoreUser(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.userService.restore(id);
  }
}
