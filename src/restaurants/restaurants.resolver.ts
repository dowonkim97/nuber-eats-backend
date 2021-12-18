import { Query, Resolver } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurants.entity';

// @Resolver가 Restaurant의 Resolver가 됨
// "(of) => Restaurant"는 꼭 필요한 게 아니라서 삭제해도 됨
@Resolver()
export class RestaurantReslover {
  // Restaurant을 return(반환)한다.
  @Query((returns) => Restaurant)
  myRestaurant() {
    return true;
  }
}
