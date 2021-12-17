import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { File } from '../file-upload/entities/file-upload.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postService: PostsService) {}

  @Query(() => [Post], { name: 'getAllPosts' })
  list() {
    return this.postService.list();
  }

  @Query(() => Post, { name: 'getPostById' })
  findById(@Args('id', { type: () => ID }) id: string) {
    return this.postService.findById(id);
  }

  @Mutation(() => Post, { name: 'createNewPost' })
  createPost(@Args('createPostInput') createPostInput: CreatePostInput) {
    return this.postService.create(createPostInput);
  }

  @Mutation(() => Post, { name: 'updatePostById' })
  updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
    return this.postService.update(updatePostInput.id, updatePostInput);
  }

  @Mutation(() => Post, { name: 'removePost' })
  removePost(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.postService.remove(id);
  }

  @Mutation(() => Post, { name: 'restorePost' })
  restorePost(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.postService.restore(id);
  }

  @Mutation(() => File, { name: 'uploadImageToPost' })
  async uploadFile(
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
    @Args('postId') postId: string,
  ): Promise<File> {
    const { createReadStream, filename } = await file;
    const stream = createReadStream();
    const chunks = [];
    let buffer = await new Promise<Buffer>((resolve, reject) => {
      let buffer: Buffer;
      stream.on('data', function (chunk) {
        chunks.push(chunk);
      });
      stream.on('end', function () {
        buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
      stream.on('error', reject);
    });
    buffer = Buffer.concat(chunks);
    return this.postService.addImage(postId, buffer, filename);
  }
}
