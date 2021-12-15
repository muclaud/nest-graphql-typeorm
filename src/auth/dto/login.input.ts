import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LogInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  plainTextPassword: string;
}
