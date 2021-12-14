import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { RegistrationInput } from '../auth/dto/registration.input';

const pubSub = new PubSub();

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => User)
  async getUserById(@Args('id') id: number): Promise<User> {
    const user = await this.usersService.getById(id);
    if (!user) {
      throw new NotFoundException(id);
    }
    return user;
  }

  @Query((returns) => User)
  async getUserByEmail(@Args('email') email: string): Promise<User> {
    const user = await this.usersService.getByEmail(email);
    if (!user) {
      throw new NotFoundException(email);
    }
    return user;
  }

  @Query((returns) => [User])
  async users(): Promise<User[]> {
    return await this.usersService.getAllUsers();
  }

  @Mutation((returns) => User)
  async addUser(
    @Args('newUserData') newUserData: RegistrationInput,
  ): Promise<User> {
    const user = await this.usersService.create(newUserData);
    pubSub.publish('userAdded', { userAdded: user });
    return user;
  }

  @Mutation((returns) => Boolean)
  async removeUser(@Args('id') id: number) {
    return this.usersService.remove(id);
  }

  @Subscription((returns) => User)
  userAdded() {
    return pubSub.asyncIterator('userAdded');
  }
}
