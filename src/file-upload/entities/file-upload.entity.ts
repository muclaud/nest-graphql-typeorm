import { Column, Entity } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

import { EntityBase } from '../../common/entities/entityBase';

@ObjectType()
@Entity('Files')
export class File extends EntityBase {
  @Column()
  @Field(() => String)
  filename: string;

  @Field(() => String)
  @Column({
    type: 'bytea',
  })
  data: Uint8Array;
}
