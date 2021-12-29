import { ArgsType, Field, InputType, OmitType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';
import { Restaurant } from '../entities/restaurants.entity';

//@InputType()

@InputType()
export class createRestaurantDto extends OmitType(Restaurant, ['id']) {}
