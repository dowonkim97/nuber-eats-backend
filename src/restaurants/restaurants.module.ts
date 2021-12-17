import { Module } from '@nestjs/common';
import { RestaurantReslover } from './restaurants.resolver';

@Module({
  providers: [RestaurantReslover],
})
export class RestaurantsModule {}
