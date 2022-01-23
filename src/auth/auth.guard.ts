import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGaurd implements CanActivate {
  canActivate(context: ExecutionContext) {
    // console.log(context);
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user = gqlContext['user'];
    if (!user) {
      return false;
    }
    return true;
  }
}
