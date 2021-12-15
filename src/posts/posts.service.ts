import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private postRepo: Repository<Post>) {}

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
    let existedPost = await this.findById(id);
    await this.postRepo.remove(existedPost);
    existedPost.id = id;
    return existedPost;
  }
}
