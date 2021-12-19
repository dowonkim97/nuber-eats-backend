import { ArgsType, Field } from '@nestjs/graphql';

//@InputType()

@ArgsType()
export class createRestaurantDto {
  @Field((type) => String)
  name: string;
  @Field((type) => Boolean)
  isVegan: boolean;
  @Field((type) => String)
  address: string;
  @Field((type) => String)
  ownerName: string;
}
