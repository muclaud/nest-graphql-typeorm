import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadService } from './file-upload.service';
import { FileUploadResolver } from './file-upload.resolver';
import { File } from './entities/file-upload.entity';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  providers: [FileUploadResolver, FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
