import { Test } from '@nestjs/testing';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailService } from './mail.service';
// describe, beforeEach, expect = jest auto import

jest.mock('got', () => {});
jest.mock('form-data', () => {
  return {
    append: jest.fn(),
  };
});

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
            domain: 'test_domain',
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
      jest.spyOn(service, 'sendEmail').mockImplementation(async () => {});
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
  it.todo('sendEmail');
});
