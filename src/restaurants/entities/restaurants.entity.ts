import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType() // graphQL을 위한 Restaurant의 ObjectType
@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id: number;

  // arg type은 아무 의미 없기 때문에 아무거나 넣어도 됨
  // name이라는 1개의 필드를 가지고 있다.
  @Field((type) => String)
  @Column()
  name: string;
  // isGood이라는 1개의 필드를 가지고 있다. (제거함)
  @Field((type) => Boolean)
  @Column()
  // nullable이기 떄문에 ?를 붙여준다.
  // isGood? -> isVegan으로 변경, { nullable: true } 삭제
  isVegan: boolean;

  @Field((type) => String)
  @Column()
  address: string;

  @Field((type) => String)
  @Column()
  ownerName: string;

  @Field((type) => String)
  @Column()
  categoryname: string;
}
