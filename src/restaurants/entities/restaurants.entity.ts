import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Restaurant {
  // arg type은 아무 의미 없기 때문에 아무거나 넣어도 됨
  // name이라는 1개의 필드를 가지고 있다.
  @Field((type) => String)
  name: string;
  // isGood이라는 1개의 필드를 가지고 있다.
  @Field((type) => Boolean, { nullable: true })
  // nullable이기 떄문에 ?를 붙여준다.
  isGood?: boolean;
}
