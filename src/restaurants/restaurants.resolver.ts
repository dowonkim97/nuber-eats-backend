import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class RestaurantReslover {
  // graphql 위한 Boolean은 지우면 안됨
  @Query((returns) => Boolean)
  // typescript 위한 Boolean 지워도 상관없음
  isGoodKimchi(): Boolean {
    return true;
  }
}
