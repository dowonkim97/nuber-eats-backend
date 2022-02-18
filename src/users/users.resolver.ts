import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthGaurd } from 'src/auth/auth.guard';
import {
  createAccountInput,
  createAccountOutput,
} from './dtos/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-Profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';
import { User } from './entities/users.entity';
import { UserService } from './users.service';

@Resolver((of) => User) // of가 function 이거나 없어도 된다.
export class UsersResolver {
  constructor(private readonly usersService: UserService) {}

  @Query((returns) => Boolean)
  hi() {
    return true;
  }
  // get input
  @Mutation((returns) => createAccountOutput)
  // resolver에는 createAccount function이 있다.
  async createAccount(
    @Args('input') createAccountInput: createAccountInput,
  ): Promise<createAccountOutput> {
    `
    try {
      // service return
      // error function은 error에 대해 요청(asking)한다.
      // createAccount는 string이나 undefined를 return한다.
      // createAccount 뿐만 아니라 service에도 올바른 데이터를 전달해준다.
      return await this.usersService.createAccount(createAccountInput);
  
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
    
    } catch (error) {
      // 예상하지 못한 에러가 있으면 error를 return하고, ok는 false이다.
      return {
        error,
        ok: false,
      };
    }
    `;
    return this.usersService.createAccount(createAccountInput);
  }

  @Mutation((returns) => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    `
    try {
      return await this.usersService.login(loginInput);
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  `;
    return this.usersService.login(loginInput);
  }

  /*
  // 매번 request 마다 context 받는다.
  me(@Context() context) {
    // console.log(context);
    // user가 없으면 넘어간다.
    if (!context.user) {
      return;
      // user가 있다면 에러를 보여준다.
    } else {
      return context.user;
    }
  }
  */
  // me Query로 see my profile
  @Query((returns) => User)
  @UseGuards(AuthGaurd)
  // me(), resolver에서 request를 보내고 있는 주체를 알아야 한다.
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @UseGuards(AuthGaurd) // end point를 보호한다.
  @Query((returns) => UserProfileOutput)
  // user(id) change -> userProfile(@Args()), add UserProfileInput import type UserProfileInput
  async userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    // findById는 token을 위해 만든 function이다.
    // UserProfileInput에서 userId를 찾는다.
    `
    try {
      const user = await this.usersService.findById(userProfileInput.userId);
      // user 못 찾으면 return 쪽으로 보냄
      if (!user) {
        throw Error();
      }
      return {
        ok: true,
        user,
      };
    } catch (e) {
      // user 못 찾으면 여기로 보냄
      return {
        error: 'User Not Found',
        ok: false,
      };
    }
    `;
    return this.usersService.findById(userProfileInput.userId);
  }
  @UseGuards(AuthGaurd)
  @Mutation((returns) => EditProfileOutput)
  async editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    `
    try {
      console.log(editProfileInput);
      await this.usersService.editProfile(authUser.id, editProfileInput);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
    `;
    return this.usersService.editProfile(authUser.id, editProfileInput);
  }
  //  @UseGuards(AuthGaurd) 인증 여부는 없어도 될 것 같음
  @Mutation((returns) => VerifyEmailOutput) // graphql을 위한 VerifyEmailOutput
  // 또는 VerifyEmailInput 대신 {code}, VerifyEmailInput.code 대신 code를 넣어도 된다.
  verifyEmail(
    @Args('input') { code }: VerifyEmailInput, // nestjs를 위한 VerifyEmailInput
  ): Promise<VerifyEmailOutput> {
    // TypeScript를 위한 VerifyEmailOutput
    // VerifyEmailOutput은 resolver로써 output을 service에도 공유할 수 있다.
    `
    try {
      await this.usersService.verifyEmail(code);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
    `;
    return this.usersService.verifyEmail(code);
  }
}
