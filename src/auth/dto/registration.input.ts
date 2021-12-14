import { Field, InputType } from '@nestjs/graphql';
import {
  IsOptional,
  Length,
  MaxLength,
  IsEmail,
  IsString,
  MinLength,
} from 'class-validator';

@InputType()
export class RegistrationInput {
  @Field()
  @MaxLength(30)
  firstName: string;

  @Field()
  @MaxLength(30)
  lastName: string;

  @Field()
  @MaxLength(50)
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(30, 255)
  description?: string;
}
