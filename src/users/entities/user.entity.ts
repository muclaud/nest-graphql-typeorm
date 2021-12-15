import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

import { EntityBase } from '../../common/entities/entityBase';
import { Account } from '../../auth/entities/auth.entity';

@ObjectType()
@Entity('Users')
export class User extends EntityBase {
  @Field(() => String)
  @Column({ name: 'first_name', type: 'varchar', length: 50 })
  firstName: string;

  @Field(() => String)
  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Field(() => String)
  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;

  @Field(() => String, { nullable: true })
  @Column({ name: 'address', type: 'varchar', length: 500, nullable: true })
  address: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'city', type: 'varchar', length: 100, nullable: true })
  city: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'country', type: 'varchar', length: 100, nullable: true })
  country: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'mobile', type: 'varchar', length: 11, nullable: true })
  mobile: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Field(() => Account, { nullable: true })
  @OneToOne(() => Account, (account) => account.user)
  @JoinColumn({ name: 'user_id' })
  account: Account;
}
