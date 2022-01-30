import { v4 as uuidv4 } from 'uuid';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
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

  // code 생성하는 곳에 하는 이유는 다른 곳에도 verification 생성 가능하게 함
  @BeforeInsert()
  createCode(): void {
    // js에서 랜덤 코드는 어떻게 생성할까? -> uuid, Math().random()
    this.code = uuidv4().replace(/-/g, '');
  }
}
