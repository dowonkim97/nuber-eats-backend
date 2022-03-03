import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { JwtModuleOptions } from './jwt.interfaces';

@Injectable()
export class JwtService {
  // Nest can't resolve dependencies of the JwtService (?).
  // dependencies : 서비스가 동작하기 위해 의존해야 한다는 뜻
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {
    // { privateKey: 'testKey' }
    // console.log(options);
  }
  sign(userId: number): string {
    console.log(userId);
    return jwt.sign({ id: userId }, this.options.privateKey);
  }
  verify(token: string) {
    return jwt.verify(token, this.options.privateKey);
  }
}
