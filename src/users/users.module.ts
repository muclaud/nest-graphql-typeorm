import { Module } from '@nestjs/common';
import { DateScalar } from '../common/scalars/date.scalars';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.model';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersResolver, UsersService, DateScalar],
})
export class UsersModule {}
