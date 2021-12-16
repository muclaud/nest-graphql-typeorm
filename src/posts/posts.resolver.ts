import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postService: PostsService) {}

  @Query(() => [Post], { name: 'posts' })
  list() {
    return this.postService.list();
  }

  @Query(() => Post, { name: 'post' })
  findById(@Args('id', { type: () => ID }) id: string) {
    return this.postService.findById(id);
  }

  @Mutation(() => Post)
  createPost(@Args('createPostInput') createPostInput: CreatePostInput) {
    return this.postService.create(createPostInput);
  }

  @Mutation(() => Post)
  updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
    return this.postService.update(updatePostInput.id, updatePostInput);
  }

  @Mutation(() => Post)
  removePost(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.postService.remove(id);
  }

  @Mutation(() => Post)
  restorePost(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.postService.restore(id);
  }
}
