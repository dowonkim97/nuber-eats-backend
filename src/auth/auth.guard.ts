import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGaurd implements CanActivate {
  canActivate(context: ExecutionContext) {
    // console.log(context);
    const gqlContext = GqlExecutionContext.create(context).getContext();
    // context에서 user를 찾는다.
    const user = gqlContext['user'];
    // user가 있다면 true, 없다면 false
    if (!user) {
      return false;
    }
    return true;
  }
}
