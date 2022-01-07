import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import {
  createAccountInput,
  createAccountOutput,
} from './dtos/create-account.dto';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';

@Resolver((of) => User) // of가 function 이거나 없어도 된다.
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => Boolean)
  hi() {
    return true;
  }

  @Mutation((returns) => createAccountOutput)
  createAccount(@Args('input') createAccountInput: createAccountInput) {}
}
