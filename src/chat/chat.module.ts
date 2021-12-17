import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { Message } from './entities/message.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Message])],
  providers: [ChatResolver, ChatService],
})
export class ChatModule {}
