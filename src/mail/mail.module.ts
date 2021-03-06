import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailModuleOptions } from './mail.interfaces';
import { MailService } from './mail.service';

@Module({})
// sendVerificationEmail을 전역으로 쓸수있게 @Global() 추가
@Global()
export class MailModule {
  static forRoot(options: MailModuleOptions): DynamicModule {
    return {
      module: MailModule,
      // jwt.interfaces.ts와 같이 CONFIG_OPTIONS을 만든다.
      providers: [
        { provide: CONFIG_OPTIONS, useValue: options },
        // providers MailService 추가
        MailService,
      ],
      // exports MailService 추가
      exports: [MailService],
    };
  }
}
