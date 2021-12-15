import { PartialType, InputType, Field, ID } from '@nestjs/graphql';
import { CreatePostInput } from './create-post.input';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdatePostInput extends PartialType(CreatePostInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
