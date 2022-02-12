import { DynamicModule, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailModuleOptions } from './mail.interfaces';

@Module({})
export class MailModule {
  static forRoot(options: MailModuleOptions): DynamicModule {
    return {
      module: MailModule,
      // jwt.interfaces.ts와 같이 CONFIG_OPTIONS을 만든다.
      providers: [{ provide: CONFIG_OPTIONS, useValue: options }],
      exports: [],
    };
  }
}
