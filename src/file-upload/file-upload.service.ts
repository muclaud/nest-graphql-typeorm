import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { File } from './entities/file-upload.entity';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async findById(id: string) {
    let existedImage = await this.fileRepository.findOne(id);
    if (!existedImage) throw new NotFoundException('image not found');
    return existedImage;
  }

  async uploadDatabaseFile(
    dataBuffer: Buffer,
    filename: string,
    queryRunner: QueryRunner,
  ) {
    const newFile = await queryRunner.manager.create(File, {
      filename,
      data: dataBuffer,
    });
    await queryRunner.manager.save(File, newFile);
    return newFile;
  }

  async deleteFileWithQueryRunner(fileId: string, queryRunner: QueryRunner) {
    const deleteResponse = await queryRunner.manager.delete(File, fileId);
    if (!deleteResponse.affected) {
      throw new NotFoundException();
    }
  }

  async getFileById(fileId: string) {
    const file = await this.fileRepository.findOne(fileId);
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }
}
