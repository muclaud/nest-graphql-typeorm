import {
  BaseEntity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Column,
} from 'typeorm';

import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export abstract class EntityBase extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => String)
  @Column({
    name: 'created_by',
    type: 'varchar',
    length: '100',
    default: 'app_dev',
  })
  createdBy: string;

  @Field(() => String, { nullable: true })
  @Column({
    name: 'updated_by',
    type: 'varchar',
    length: '100',
    nullable: true,
  })
  updatedBy?: string;

  @Field(() => Boolean)
  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;
}
