import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category.entity';

@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType() // graphQL을 위한 Restaurant의 ObjectType
@Entity()
export class Restaurant extends CoreEntity {
  /* id delete -> extends CoreEntity, it same users.entitiy.ts user id createdAt, updatedAt 
 @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id: number; 
  */

  // arg type은 아무 의미 없기 때문에 아무거나 넣어도 됨
  // name이라는 1개의 필드를 가지고 있다.
  @Field((type) => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;
  /*  
 // isGood이라는 1개의 필드를 가지고 있다. (제거함)
  @Field((type) => Boolean, { nullable: true }) // graphql 스키마에서 기본값 true -> { nullable: true }
  @Column({ default: true }) // database를 기본값 true
  @IsOptional() // vaidation은 optional
  @IsBoolean() // value가 있으면 boolean
  // nullable이기 떄문에 ?를 붙여준다.
  // isGood? -> isVegan으로 변경, { nullable: true } 삭제
  isVegan: boolean; 
  */

  // graphql String, Cover Image
  @Field((type) => String)
  @Column()
  @IsString()
  coverImg: string;

  @Field((type) => String, { defaultValue: '그래' })
  @Column()
  @IsString()
  address: string;

  // restaurant는 하나의 category를 가진다.
  // many-to-one relations
  // restaurant에는 category가 있기도 하고, null(없기)도 한 선택적이기 때문에 { nullable: true } 해준다.
  @Field((type) => Category, { nullable: true })
  // category 지우면 category만 지워진다.
  @ManyToOne((type) => Category, (category) => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category;

  // 모든 restaurant에 owner가 있기 때문에 필수이기 때문에 { nullable: true }를 빼준다.
  @Field((type) => User)
  // owner 지우면 restaurant도 지워진다.
  // user entity에 owner가 많을 수도 있기 때문에 OneToMany를 써준다.
  @ManyToOne((type) => User, (user) => user.restaurants)
  owner: User;
}
