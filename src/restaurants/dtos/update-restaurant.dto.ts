import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateRestaurantDto } from './create-resturant.dto';

@InputType()
export class updateRestaurantInputType extends PartialType(
  CreateRestaurantDto,
) {}

@InputType()
export class updateRestaurantDto {
  @Field((type) => Number) id: number;

  @Field((type) => updateRestaurantInputType) data: updateRestaurantInputType;
}
