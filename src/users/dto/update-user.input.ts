import { PartialType, InputType, Field, ID } from '@nestjs/graphql';

import { CreateUserInput } from './create-user.input';

import { IsUUID } from 'class-validator';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
