import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

import { EntityBase } from '../../common/entities/entityBase';
import { Account } from '../../auth/entities/auth.entity';

@ObjectType()
@Entity('Posts')
export class Post extends EntityBase {
  @Field(() => String)
  @Column({ name: 'title', type: 'varchar', length: 50 })
  title: string;

  @Field(() => String)
  @Column({ name: 'description', type: 'varchar', length: 100, nullable: true })
  description: string;

  @Field(() => [String])
  @Column({ name: 'paragraphs', array: true })
  paragraphs: string;

  @Field(() => [String], { nullable: true })
  @Column({ name: 'categories', array: true, nullable: true })
  categories: string;

  @Field(() => [String], { nullable: true })
  @Column({ name: 'keywords', array: true, nullable: true })
  keywords: string;

  @Field(() => Boolean)
  @Column({ name: 'private' })
  private: boolean;

  @Field(() => String, { nullable: true })
  @Column({ name: 'account_id', nullable: true })
  accountId: string;

  @Field(() => Account, { nullable: true })
  @ManyToOne(() => Account, (account) => account.user)
  @JoinColumn({ name: 'account_id' })
  account: Account;
}
