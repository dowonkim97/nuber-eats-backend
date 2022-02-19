import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../users/users.service';
import { User } from './entities/users.entity';
import { Verification } from './entities/verification.entity';
import { JwtService } from '../../src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
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
// Partial <Record> Make all properties in T optional
// Record <"hello", number>Construct a type with a set of properties K of type T
// <Repository의 T는 typeorm의 entity, 모든 키를 가져오는 keyof, <T> type은 jest.Mock
// MockRepository는 Repository의 모든 함수를 말한다.
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
// Nest can't resolve dependencies of the UserService (UserRepository, VerificationRepository, JwtService, ?). Please make sure that the argument MailService at index [3] is available in the RootTestModule context.
const mockMailService = {
  // mail.service.ts에는 sendVerificationEmail가 있다.
  sendVerificationEmail: jest.fn(),
};
describe('UserService', () => {
  let service: UserService;
  // MockRepository의 <User>는 findOne, save, create 같은 것이다.
  let usersRepository: MockRepository<User>;
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
        // this.users.findOne와 같은 Response를 속이고, UserRepository를 가져오기 위해 getRepositoryToken이 필요하다.
        { provide: getRepositoryToken(User), useValue: mockRepository },
        // Nest can't resolve dependencies of the UserService (UserRepository, ?, JwtService, MailService). Please make sure that the argument VerificationRepository at index [1] is available in the RootTestModule context.
        { provide: getRepositoryToken(Verification), useValue: mockRepository },
        // Nest can't resolve dependencies of the UserService (UserRepository, VerificationRepository, ?, MailService). Please make sure that the argument JwtService at index [2] is available in the RootTestModule context.
        { provide: JwtService, useValue: mockJwtService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    // usersRepository는 any
    usersRepository = module.get(getRepositoryToken(User));
  });

  // usersRepository. 하면 모든 함수를 가지고 있고, 모두 가짜 함수다.
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // users.service.ts 5가지 항목을 테스트 한다.

  describe('createAccount', () => {
    it('유저가 존재하면 fail 하게 된다.', () => {});
  });
  it.todo('login');
  it.todo('findById');
  it.todo('editProfile');
  it.todo('verifyEmail');
});
