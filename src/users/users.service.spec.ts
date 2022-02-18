import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../users/users.service';
import { User } from './entities/users.entity';
import { Verification } from './entities/verification.entity';
import { JwtService } from '../../src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
// mockRepository는 가짜 레파지토리이다.
const mockRepository = {
  // fn()는 가짜 function이다.
  // users.service.ts에는 findOne, save, create가 있다.
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
};
const mockJwtService = {
  // jwt.service.ts에는 sign, verify가 있다.
  sign: jest.fn(),
  verify: jest.fn(),
};
// Nest can't resolve dependencies of the UserService (UserRepository, VerificationRepository, JwtService, ?). Please make sure that the argument MailService at index [3] is available in the RootTestModule context.
const mockMailService = {
  // mail.service.ts에는 sendVerificationEmail가 있다.
  sendVerificationEmail: jest.fn(),
};
describe('UserService', () => {
  let service: UserService;

  beforeAll(async () => {
    // testing module을 만든다.
    const module = await Test.createTestingModule({
      providers: [
        // 진짜 userService를 호출함. 아래는 가짜 Mock임.
        UserService,
        // users.service에서 진짜 (User) Repository를 불러오는 것이 아니라, Mock Repository를 제공함
        // Mock은 UserService만 단독으로 테스트 하기 위해 가짜 function, class 실행
        // useValue는 가짜 값이다.
        // TypeOrm에게 거짓말한다.
        { provide: getRepositoryToken(User), useValue: mockRepository },
        // Nest can't resolve dependencies of the UserService (UserRepository, ?, JwtService, MailService). Please make sure that the argument VerificationRepository at index [1] is available in the RootTestModule context.
        { provide: getRepositoryToken(Verification), useValue: mockRepository },
        // Nest can't resolve dependencies of the UserService (UserRepository, VerificationRepository, ?, MailService). Please make sure that the argument JwtService at index [2] is available in the RootTestModule context.
        { provide: JwtService, useValue: mockJwtService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // users.service.ts 5가지 항목을 테스트 한다.
  it.todo('createAccount');
  it.todo('login');
  it.todo('findById');
  it.todo('editProfile');
  it.todo('verifyEmail');
});
