import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './users.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  // 인증코드 필요 verification code
  @Column()
  @Field((type) => String)
  code: string;

  // one-to-one relations
  @OneToOne((type) => User)
  @JoinColumn()
  user: User;
}
