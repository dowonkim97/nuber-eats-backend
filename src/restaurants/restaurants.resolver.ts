import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entities/users.entity';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-resturant.dto';
import { Restaurant } from './entities/restaurants.entity';
import { RestaurantService } from './restaurants.service';

// @Resolver가 Restaurant의 Resolver가 됨
// "(of) => Restaurant"(직관적) 꼭 필요한 게 아니라서 삭제해도 됨
@Resolver((of) => Restaurant)
export class RestaurantReslover {
  constructor(private readonly restaurantService: RestaurantService) {}

  /*
  // Restaurant을 return(반환)한다.
  // GraphQL [Restaurant]
  @Query((returns) => [Restaurant])
  // 타입스크립트 Restaurant[]
  // @Args('veganOnly')는 GraphQL,  veganOnly는 function
  restaurants(): Promise<Restaurant[]> {
    // console.log(veganOnly);
    return this.restaurantService.getAll();
  } 
*/

  @Mutation((returns) => CreateRestaurantOutput)
  async createRestaurant(
    /*
    @Args('name') name: string,
    @Args('isVegan') isVegan: boolean,
    @Args('address') address: string,
    @Args('ownerName') ownerName: string,
    */
    @AuthUser() authUser: User,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    console.log(createRestaurantInput);
    // console.log(createRestaurantInput);
    // console.log(createRestaurantDto);
    return this.restaurantService.createRestaurant(
      authUser,
      createRestaurantInput,
    );
  }
  /*  
 @Mutation((returns) => Boolean)
  async updateRestaurant(
    @Args('input') updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<boolean> {
    try {
      await this.restaurantService.updateRestaurant(updateRestaurantDto);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  } 
*/
}
