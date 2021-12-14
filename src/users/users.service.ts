import { Injectable, BadRequestException } from '@nestjs/common';
import { RegistrationInput } from '../auth/dto/registration.input';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(data: RegistrationInput): Promise<User> {
    const newUser = await this.userRepository.create({
      ...data,
      creationDate: new Date(),
    });
    await this.userRepository.save(newUser);
    return newUser;
  }

  async getById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new BadRequestException('User with this id does not exist');
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new BadRequestException('User with this email does not exist');
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async remove(id: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new BadRequestException('User with this id does not exist');
    }
    await this.userRepository.delete({ id });
    return true;
  }
}
