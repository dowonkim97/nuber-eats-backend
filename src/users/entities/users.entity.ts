import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
// jest는 CoreEntity 경로와 같은 형식이 되지 않는다.
import { CoreEntity } from 'src/common/entities/core.entity';
import * as bcrypt from 'bcrypt';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { IsString, IsBoolean, IsEmail, IsEnum } from 'class-validator';
import { Restaurant } from 'src/restaurants/entities/restaurants.entity';

enum UserRole {
  Client,
  Owner,
  Delivery,
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column({ unique: true })
  @Field((type) => String)
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Field((type) => String)
  // add users entity validation @IsString
  @IsString()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  @Field((type) => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: false })
  @Field((type) => Boolean)
  // add users entity validation @IsBoolean
  @IsBoolean()
  verified: boolean;

  // 하나의 category가 여러 restaurant(restaurants)를 가질 수 있다.
  @Field((type) => [Restaurant])
  @OneToMany((type) => Restaurant, (restaurant) => restaurant.owner)
  restaurants: Restaurant[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
        // 패스워드를 못생기게 바꾼다.
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }
  // checkPassword는 user가 우리에게 준 password를 받는다.
  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      // compare 같은지 안 같은지 비교
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
