import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { Post } from './entities/post.entity';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    private fileUploadService: FileUploadService,
    private connection: Connection,
  ) {}

  list() {
    return this.postRepo.find({ order: { createdAt: 'ASC' } });
  }

  async findById(id: string) {
    let existedPost = await this.postRepo.findOne(id);
    if (!existedPost) throw new NotFoundException('post not found');
    return existedPost;
  }

  create(createPostInput: CreatePostInput) {
    let newPost = this.postRepo.create(createPostInput);
    return this.postRepo.save(newPost);
  }

  async update(id: string, updatePostInput: UpdatePostInput) {
    let existedPost = await this.findById(id);
    let PostToUpdate = this.postRepo.merge(existedPost, updatePostInput);
    return this.postRepo.save(PostToUpdate);
  }

  async remove(id: string) {
    let existedPost = await this.postRepo.softDelete(id);
    if (!existedPost.affected) throw new NotFoundException('post not found');
    return existedPost;
  }

  async restore(id: string) {
    let existedPost = await this.postRepo.restore(id);
    if (!existedPost.affected) throw new NotFoundException('post not found');
    return existedPost;
  }

  async addImage(postId: string, imageBuffer: Buffer, filename: string) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const post = await queryRunner.manager.findOne(Post, postId);
      const currentImageId = post.imageId;
      const image = await this.fileUploadService.uploadDatabaseFile(
        imageBuffer,
        filename,
        queryRunner,
      );

      await queryRunner.manager.update(Post, postId, {
        imageId: image.id,
      });

      if (currentImageId) {
        await this.fileUploadService.deleteFileWithQueryRunner(
          currentImageId,
          queryRunner,
        );
      }

      await queryRunner.commitTransaction();

      return image;
    } catch {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }
}
