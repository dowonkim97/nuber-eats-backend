import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import {
  createAccountInput,
  createAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
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
  // resolver에는 createAccount function이 있다.
  async createAccount(
    @Args('input') createAccountInput: createAccountInput,
  ): Promise<createAccountOutput> {
    try {
      // error function은 error에 대해 요청(asking)한다.
      // createAccount는 string이나 undefined를 return한다.
      return await this.usersService.createAccount(createAccountInput);
      `
      // 에러가 있으면 ok는 false, error return한다.
      if (error) {
        return {
          ok: false,
          error,
        };
      }
      // 에러가 없으면 ok는 true를 return한다.
      return {
        ok: true,
      };
      `;
    } catch (error) {
      // 예상하지 못한 에러가 있으면 error를 return하고, ok는 false이다.
      return {
        error,
        ok: false,
      };
    }
  }

  @Mutation((returns) => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    try {
      return await this.usersService.login(loginInput);
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
  // JWT를 만들고 user에게 준다(give).
  @Query((returns) => User)
  me() {}
}
