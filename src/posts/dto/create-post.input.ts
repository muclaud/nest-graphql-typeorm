import { InputType, Field } from '@nestjs/graphql';

import { IsString, Length } from 'class-validator';

@InputType()
export class CreatePostInput {
  @Field(() => String)
  @IsString()
  @Length(2, 50)
  title: string;

  @Field(() => String)
  @IsString()
  @Length(2, 100)
  description: string;

  @Field(() => [String])
  @IsString({ each: true })
  paragraphs: string;

  @Field(() => [String], { nullable: true })
  @IsString({ each: true })
  categories: string;

  @Field(() => [String], { nullable: true })
  @IsString({ each: true })
  keywords: string;

  @Field(() => Boolean, { defaultValue: false })
  private: boolean;
}
