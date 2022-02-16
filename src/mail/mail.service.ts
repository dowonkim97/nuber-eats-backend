import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { EmailVar, MailModuleOptions } from './mail.interfaces';
import got from 'got';
// form_data_1.default is not a constructor -> * as
import * as FormData from 'form-data';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {
    // 이메일을 보내는 기능 -> 인증메일을 보내는 서비스
    // console.log(options);
    // this.sendEmail('testing', 'test')
    //   .then(() => {
    //     console.log('Message sent');
    //   })
    //   .catch((e) => {
    //     console.log(e.response.body);
    //   });
  }

  private async sendEmail(
    subject: string,
    template: string,
    emailVars: EmailVar[],
  ) {
    const form = new FormData();
    form.append('from', `Do Won <mailgun@${this.options.domain}>`);
    form.append('to', `${this.options.fromEmail}`);
    form.append('subject', subject);
    form.append('template', template);
    // 자바스크립트 키워드인 var 대신 emailVar를 사용한다.
    emailVars.forEach((emailVar) =>
      form.append(`v:${emailVar.key}`, emailVar.value),
    );
    try {
      await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
        method: 'POST',
        headers: {
          // node > Buffer.from(`api:YOUR_API_KEY`).toString(`base64`)
          // Buffer는 Node.js 에서 제공하는 Binary의 데이터를 담을 수 있는 객체
          Authorization: `Basic ${Buffer.from(
            `api:${this.options.apiKey}`,
          ).toString('base64')}`,
        },
        body: form,
      });
    } catch (e) {
      // Quietly fail 에러 있어도 알리지 않음
      console.log(e);
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('이메일 인증', 'signup', [
      { key: 'code', value: code },
      { key: 'username', value: email },
    ]);
  }
}
