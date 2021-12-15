import { Field, InputType } from '@nestjs/graphql';
import {
  IsDateString,
  MaxLength,
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

@InputType()
export class RegistrationInput {
  @Field()
  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Field()
  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Field()
  @MaxLength(50)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password: string;

  @Field(() => String)
  @IsDateString()
  birthDate: string;
}
