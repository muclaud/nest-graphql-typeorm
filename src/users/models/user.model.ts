import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Entity('User')
@ObjectType({ description: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  email: string;

  @Field({ nullable: true })
  @Column()
  description?: string;

  @Field()
  @Column()
  creationDate: Date;
}
