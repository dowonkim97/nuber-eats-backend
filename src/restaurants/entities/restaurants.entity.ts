import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@InputType({ isAbstract: true })
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
  @IsString()
  @Length(5)
  name: string;
  // isGood이라는 1개의 필드를 가지고 있다. (제거함)
  @Field((type) => Boolean, { nullable: true }) // graphql 스키마에서 기본값 true
  @Column({ default: true }) // database를 기본값 true
  @IsOptional() // vaidation은 optional
  @IsBoolean() // value가 있으면 boolean
  // nullable이기 떄문에 ?를 붙여준다.
  // isGood? -> isVegan으로 변경, { nullable: true } 삭제
  isVegan: boolean;

  @Field((type) => String, { defaultValue: '그래' })
  @Column()
  @IsString()
  address: string;
}
