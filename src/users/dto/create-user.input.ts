import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, Length, MaxLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @MaxLength(30)
  name: string;

  @Field()
  @MaxLength(50)
  email: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(30, 255)
  description?: string;
}
