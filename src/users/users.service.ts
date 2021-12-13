import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './models/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(data: CreateUserInput): Promise<User> {
    const newUser = await this.userRepository.create({
      creationDate: new Date(),
      ...data,
    });
    await this.userRepository.save(newUser);
    return newUser;
  }

  async getById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async remove(id: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.userRepository.delete({ id });
    return true;
  }
}
