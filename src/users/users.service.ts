import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../auth/entities/auth.entity';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Account) private accountRepo: Repository<Account>,
  ) {}

  findUser(accountId: string) {
    return this.accountRepo.findOne(accountId);
  }

  list() {
    return this.userRepo.find({ order: { createdAt: 'ASC' } });
  }

  async findById(id: string) {
    let existedUser = await this.userRepo.findOne(id);
    if (!existedUser) throw new NotFoundException('user profile not found');
    return existedUser;
  }

  create(createUserInput: CreateUserInput) {
    let newUser = this.userRepo.create(createUserInput);
    return this.userRepo.save(newUser);
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    let existedUser = await this.findById(id);
    let UserToUpdate = this.userRepo.merge(existedUser, updateUserInput);
    return this.userRepo.save(UserToUpdate);
  }

  async remove(id: string) {
    let existedUser = await this.userRepo.softDelete(id);
    if (!existedUser.affected) throw new NotFoundException('user not found');
    return existedUser;
  }

  async restore(id: string) {
    let existedUser = await this.userRepo.restore(id);
    if (!existedUser.affected) throw new NotFoundException('user not found');
    return existedUser;
  }
}
