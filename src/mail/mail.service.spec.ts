import { Test } from '@nestjs/testing';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailService } from './mail.service';
import * as FormData from 'form-data';
import got from 'got';
// describe, beforeEach, expect = jest auto import

jest.mock('got');
jest.mock('form-data');

const TEST_DOMAIN = 'test_domain';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: CONFIG_OPTIONS,
          useValue: {
            apiKey: 'test_apiKey',
            domain: TEST_DOMAIN,
            fromEmail: 'test_fromEmail',
          },
        },
      ],
    }).compile();
    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendVerificationEmail', () => {
    it('sendEmail을 호출하게 한다.', () => {
      // code, email args check
      const sendVerificationEmailArgs = {
        email: 'email',
        code: 'code',
      };
      // sendEmail called intercept call, add implementation
      // Argument of type '() => Promise<void>' is not assign
      jest.spyOn(service, 'sendEmail').mockImplementation(async () => true);
      service.sendVerificationEmail(
        sendVerificationEmailArgs.email,
        sendVerificationEmailArgs.code,
      );
      expect(service.sendEmail).toHaveBeenCalledTimes(1);
      expect(service.sendEmail).toHaveBeenCalledWith('이메일 인증', 'signup', [
        { key: 'code', value: sendVerificationEmailArgs.code },
        { key: 'username', value: sendVerificationEmailArgs.email },
      ]);
    });
  });
  describe('sendEmail', () => {
    it('이메일 전송', async () => {
      // Expected number of calls: 1, Received number of calls: 5
      // service.sendEmail('', '', [{ key: 'one', value: '1' }]);
      const ok = await service.sendEmail('', '', [
        { key: 'email', value: 'emailValue' },
      ]);
      // form.append called check
      const formSpy = jest.spyOn(FormData.prototype, 'append');
      // Expected number of calls: 1, Received number of calls: 4
      expect(formSpy).toHaveBeenCalledTimes(5);
      expect(got.post).toHaveBeenCalledTimes(1);
      // got string, object called check
      expect(got.post).toHaveBeenCalledWith(
        `https://api.mailgun.net/v3/${TEST_DOMAIN}/messages`,
        expect.any(Object),
      );
      expect(ok).toEqual(true);
    });
    it('오류 발생시 실패', async () => {
      // sendEamail got.post called, Implementation mocked, error throw
      jest.spyOn(got, 'post').mockImplementation(() => {
        throw new Error();
      });
      const ok = await service.sendEmail('', '', []);
      expect(ok).toEqual(false);
    });
  });
});
