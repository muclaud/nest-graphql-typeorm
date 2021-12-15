import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Account } from 'src/auth/entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Account])],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
