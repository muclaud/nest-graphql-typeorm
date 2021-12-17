import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { Post } from './entities/post.entity';
import { FileUploadService } from '../file-upload/file-upload.service';
import { File } from '../file-upload/entities/file-upload.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, File])],
  providers: [PostsResolver, PostsService, FileUploadService],
})
export class PostsModule {}
