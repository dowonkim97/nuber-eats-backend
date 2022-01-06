import { Resolver, Query } from '@nestjs/graphql';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';

@Resolver((of) => User) // of가 function 이거나 없어도 된다.
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => Boolean)
  hi() {
    return true;
  }
}
