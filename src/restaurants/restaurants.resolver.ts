import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { createRestaurantDto } from './dtos/create-resturant.dto';
import { Restaurant } from './entities/restaurants.entity';

// @Resolver가 Restaurant의 Resolver가 됨
// "(of) => Restaurant"(직관적) 꼭 필요한 게 아니라서 삭제해도 됨
@Resolver((of) => Restaurant)
export class RestaurantReslover {
  // Restaurant을 return(반환)한다.
  // GraphQL [Restaurant]
  @Query((returns) => [Restaurant])
  // 타입스크립트 Restaurant[]
  // @Args('veganOnly')는 GraphQL,  veganOnly는 function
  restaurants(@Args('veganOnly') veganOnly: boolean): Restaurant[] {
    // console.log(veganOnly);
    return [];
  }
  @Mutation((returns) => Boolean)
  createRestaurant(
    /*
    @Args('name') name: string,
    @Args('isVegan') isVegan: boolean,
    @Args('address') address: string,
    @Args('ownerName') ownerName: string,
    */
    @Args() createRestaurantDto: createRestaurantDto,
  ): boolean {
    // console.log(createRestaurantInput);
    console.log(createRestaurantDto);
    return true;
  }
}
