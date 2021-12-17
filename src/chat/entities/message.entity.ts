import { Entity, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

import { EntityBase } from 'src/common/entities/entityBase';
import { Account } from 'src/auth/entities/auth.entity';
import { TokenPayload } from 'src/auth/helpers/auth.types';

@ObjectType()
@Entity('Messages')
export class Message extends EntityBase {
  @Field(() => String)
  @Column({ name: 'content', type: 'varchar', length: 100 })
  content: string;

  @Field(() => Account, { nullable: true })
  @ManyToOne(() => Account, (account) => account.id)
  author: TokenPayload;
}
