import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../users/users.service';
import { User } from './entities/users.entity';
import { Verification } from './entities/verification.entity';
import { JwtService } from '../../src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
// mockRepository는 가짜 레파지토리이다.
// mock은 함수의 return 값을 속일 수 있다.
// 객체 = {} 대신 함수 = () => ({}) 를 리턴한다.
const mockRepository = () => ({
  // fn()는 가짜 function이다.
  // users.service.ts에는 findOne, save, create가 있다.
  //  findOne, save, create는 DB, SQL 같은 것들을 아무것도 하지 않는다.
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});
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
        {
          provide: getRepositoryToken(User),
          // mockRepository()가 함수를 가짐, Verification과 Repository가 달라짐
          useValue: mockRepository(),
        },
        // Nest can't resolve dependencies of the UserService (UserRepository, ?, JwtService, MailService). Please make sure that the argument VerificationRepository at index [1] is available in the RootTestModule context.
        {
          provide: getRepositoryToken(Verification),
          // mockRepository()가 함수를 가짐 User과 Repository가 달라짐
          useValue: mockRepository(),
        },
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
    // 몇 번이고 사골처럼 우려먹기 위해서 createAccountArgs를 선언해준다.
    const createAccountArgs = {
      email: '',
      password: '',
      role: 0,
    };
    it('유저가 존재하면 fail 하게 된다.', async () => {
      // users.service.ts에서 findOne이 Promise를 반환하기 때문에 mockResolvedValue()는 Promise.resolve(value) 하는 것과 같다.
      // jest가 findOne 함수를 가로채서 Promise.resolve(value)의 return 값을 속인다.
      usersRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'lalal',
      });
      // 테스트 통과 확인하기 위해 const result = 써줌
      const result = await service.createAccount(createAccountArgs);
      // 테스트 통과 확인
      expect(result).toMatchObject({
        ok: false,
        error: '해당 이메일을 가진 사용자가 이미 존재합니다.',
      });
    });
    // 함수 자체 테스트
    it('새로운 사용자를 만들게 한다.', async () => {
      // findOne 리턴 값을 mock 한다.
      // 유저가 존재하지 않는 것처럼 보이게 한다.
      // users.service.ts에 있던 findOne이 유저를 찾지 못하면, if (exist) 부분은 반환하지 않게 된다.
      //  await this.users.findOne()은 하나의 promise를 반환하기 때문에 mockResolvedValue, 그게 아닌 경우 mockReturnValue 반환한다.
      usersRepository.findOne.mockReturnValue(undefined);
      // Received: undefined 에러메시지가 나왔다. users.service.ts에 create의 리턴 값을 mock하지 않았기 때문이다.
      usersRepository.create.mockReturnValueOnce(createAccountArgs);
      await service.createAccount(createAccountArgs);
      // usersRepository.create 함수가 단 한번(1) 불린다(called).
      // Received number of calls: 2라는 2번 불렸다는 에러메시지가 출력된다.
      // UserRepository, VerificationRepository가 같은 함수라고 인식되었기 때문이다.
      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      // toHaveBeenCalledWith는 모의 함수가 호출되었는지 확인한다.
      expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs);
      // toHaveBeenCalled는 함수가 호출되었는지 확인한다.
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs);
    });
  });
  it.todo('login');
  it.todo('findById');
  it.todo('editProfile');
  it.todo('verifyEmail');
});
