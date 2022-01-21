import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {} // Injectable일 때만 inject 할 수 있다.
  async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      const decoded = this.jwtService.verify(token.toString());
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        // console.log(decoded.id);
        try {
          const user = await this.usersService.findById(decoded['id']);
          // console.log(user);
          // 사용자(user)에게 요청(request)한다.
          req['user'] = user;
        } catch (e) {}
      }
    }
    // next()를 호출하면 next handler가 request user를 받는다.
    next();
  }
}
