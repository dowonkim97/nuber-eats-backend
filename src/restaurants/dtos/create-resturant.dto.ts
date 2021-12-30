import { InputType, OmitType } from '@nestjs/graphql';
import { Restaurant } from '../entities/restaurants.entity';

//@InputType()

@InputType()
export class CreateRestaurantDto extends OmitType(Restaurant, ['id']) {}
