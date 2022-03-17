import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Restaurant } from './restaurants.entity';

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType() // graphQL을 위한 Category의 ObjectType
@Entity()
export class Category extends CoreEntity {
  // arg type은 아무 의미 없기 때문에 아무거나 넣어도 됨
  // name이라는 1개의 필드를 가지고 있다.
  @Field((type) => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  // graphql String, Cover Image
  @Field((type) => String)
  @Column()
  @IsString()
  coverImg: string;

  // 하나의 category가 여러 restaurant(restaurants)를 가질 수 있다.
  // one-to-many relations
  // graphql Restaurant array
  @Field((type) => [Restaurant])
  @OneToMany((type) => Restaurant, (restaurant) => restaurant.category)
  // Restaurant array type 복수형태
  restaurants: Restaurant[];
}
