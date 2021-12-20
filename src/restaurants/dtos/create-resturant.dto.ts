import { ArgsType, Field } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';

//@InputType()

@ArgsType()
export class createRestaurantDto {
  @Field((type) => String)
  @IsString()
  // 5 ~ 10(최대 길이)
  @Length(5, 10)
  name: string;
  @Field((type) => Boolean)
  @IsBoolean()
  isVegan: boolean;
  @Field((type) => String)
  @IsString()
  address: string;
  @Field((type) => String)
  @IsString()
  ownerName: string;
}
