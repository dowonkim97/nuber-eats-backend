import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailModuleOptions } from './mail.interfaces';
import got from 'got';
// form_data_1.default is not a constructor -> * as
import * as FormData from 'form-data';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {
    // console.log(options);
    this.sendEmail('testing', 'test')
      .then(() => {
        console.log('Message sent');
      })
      .catch((e) => {
        console.log(e.response.body);
      });
    // 이메일을 보내는 기능 -> 인증메일을 보내는 서비스
  }

  private async sendEmail(subject: string, content: string) {
    const form = new FormData();
    form.append('from', `Excited User <mailgun@${this.options.domain}>`);
    form.append('to', `${this.options.fromEmail}`);
    form.append('subject', subject);
    form.append('text', content);
    const response = await got(
      `https://api.mailgun.net/v3/${this.options.domain}/messages`,
      {
        method: 'POST',
        headers: {
          // node > Buffer.from(`api:YOUR_API_KEY`).toString(`base64`)
          // Buffer는 Node.js 에서 제공하는 Binary의 데이터를 담을 수 있는 객체
          Authorization: `Basic ${Buffer.from(
            `api:${this.options.apiKey}`,
          ).toString('base64')}`,
        },
        body: form,
      },
    );
    console.log(response.body);
  }
}
