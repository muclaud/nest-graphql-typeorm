import { Column, Entity, OneToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

import { UserRole, AccountStatus } from '../../common/types';

import { EntityBase } from '../../common/entities/entityBase';
import { User } from '../../users/entities/user.entity';

@ObjectType()
@Entity('Accounts')
export class Account extends EntityBase {
  @Field(() => String)
  @Column({ name: 'email', type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 60 })
  password: string;

  @Column({
    name: 'verification_code',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  verificationCode?: string;

  @Field(() => String)
  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @Field(() => String)
  @Column({
    name: 'status',
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.PENDING,
  })
  status: AccountStatus;

  @Field(() => User, { nullable: true })
  @OneToOne(() => User, (user) => user.account, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: ['insert', 'update', 'remove'],
  })
  user: User;
}
