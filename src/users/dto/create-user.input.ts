import { InputType, Field } from '@nestjs/graphql';

import {
  IsDateString,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsString()
  @Length(2, 20)
  firstName: string;

  @Field(() => String)
  @IsString()
  @Length(2, 20)
  lastName: string;

  @Field(() => String)
  @IsDateString()
  birthDate: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @Length(10, 500)
  address: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @Length(2, 100)
  city: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @Length(2, 100)
  country: string;

  @Field(() => String, { nullable: true })
  @IsNumberString()
  @Length(11, 11)
  mobile: string;
}
