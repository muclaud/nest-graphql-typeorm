import { Field, InputType } from '@nestjs/graphql';

import { IsEmail, IsString, Length } from 'class-validator';

@InputType()
export class ActivateInput {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsString()
  @Length(10, 10)
  verificationCode: string;
}
