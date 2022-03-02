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
  // TypeError: Cannot read properties of undefined (reading 'mockResolvedValue')
  findOneOrFail: jest.fn(),
  delete: jest.fn(),
});
// 객체 = {} 대신 함수 = () => ({}) 를 리턴한다.
const mockJwtService = () => ({
  // jwt.service.ts에는 sign, verify가 있다.
  // jwtService.sign을 mock하려고 하는데 이미 존재하기 때문에 mock implementation 한다.
  sign: jest.fn(() => 'signed-token-omg'),
  verify: jest.fn(),
});
// Partial <Record> Make all properties in T optional
// Record <"hello", number>Construct a type with a set of properties K of type T
// <Repository의 T는 typeorm의 entity, 모든 키를 가져오는 keyof, <T> type은 jest.Mock
// MockRepository는 Repository의 모든 함수를 말한다.
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
// Nest can't resolve dependencies of the UserService (UserRepository, VerificationRepository, JwtService, ?). Please make sure that the argument MailService at index [3] is available in the RootTestModule context.

// 객체 = {} 대신 함수 = () => ({}) 를 리턴한다.
const mockMailService = () => ({
  // mail.service.ts에는 sendVerificationEmail가 있다.
  sendVerificationEmail: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;
  // MockRepository의 <User>는 findOne, save, create 같은 것이다.
  let usersRepository: MockRepository<User>;
  let verificationRepository: MockRepository<Verification>;
  let mailService: MailService;
  let jwtService: JwtService;
  beforeEach(async () => {
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
          // mockRepository()가 함수를 가짐 User와 Repository가 달라짐
          useValue: mockRepository(),
        },
        // Nest can't resolve dependencies of the UserService (UserRepository, VerificationRepository, ?, MailService). Please make sure that the argument JwtService at index [2] is available in the RootTestModule context.
        { provide: JwtService, useValue: mockJwtService() },
        { provide: MailService, useValue: mockMailService() },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    mailService = module.get<MailService>(MailService);
    jwtService = module.get<JwtService>(JwtService);
    // usersRepository는 any
    usersRepository = module.get(getRepositoryToken(User));
    verificationRepository = module.get(getRepositoryToken(Verification));
  });

  // usersRepository. 하면 모든 함수를 가지고 있고, 모두 가짜 함수다.
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // users.service.ts 5가지 항목을 테스트 한다.
  describe('createAccount', () => {
    // 몇 번이고 사골처럼 우려먹기 위해서 createAccountArgs를 선언해준다.
    const createAccountArgs = {
      // Expected: Any<String>, Any<Object> Received: "", "code"
      // user object
      email: 'dowon@email.com',
      password: 'dowon.password',
      role: 0,
    };
    it('유저가 존재하면 실패하게 한다.', async () => {
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
      // "user": undefined라는 에러가 발생하기 때문에 추가해준다.
      // 'resolved' emulates returned value by an 'await'
      // 'resolved'는 'await'에 의해 반환된 값을 에뮬레이트합니다.
      // Simple sugar function for: jest.fn().mockImplementation(() => Promise.resolve(value));
      usersRepository.save.mockResolvedValue(createAccountArgs);
      // users.service.ts에서 verificationRepository.create가 verification를 return하고, user를 가지고 있다.
      verificationRepository.create.mockReturnValue({
        user: createAccountArgs,
      });
      // users.service.ts에서 verifications.save가 아무것도 return 하지 않는다.
      // Received: "", undefined 오류 메시지가 나왔다. ""는 verification은 code return 해야하고, undefined는 email, password, role을 return 해야 한다.
      verificationRepository.save.mockResolvedValue({ code: 'code' });
      // const result = 해준다.
      const result = await service.createAccount(createAccountArgs);
      // usersRepository.create 함수가 단 한번(1) 불린다(called).
      // Received number of calls: 2라는 2번 불렸다는 에러메시지가 출력된다.
      // UserRepository, VerificationRepository가 같은 함수라고 인식되었기 때문이다.
      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      // toHaveBeenCalledWith는 모의 함수가 호출되었는지 확인한다.
      expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs);

      // toHaveBeenCalled는 함수가 호출되었는지 확인한다.
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs);

      expect(verificationRepository.create).toHaveBeenCalledTimes(1);
      expect(verificationRepository.create).toHaveBeenCalledWith({
        // users.service.ts에서 this.verifications.create({user})를 하고 있기 때문에 user를 object로 주고, createAccountArgs를 call 한다.
        user: createAccountArgs,
      });
      expect(verificationRepository.save).toHaveBeenCalledTimes(1);
      expect(verificationRepository.save).toHaveBeenCalledWith({
        user: createAccountArgs,
      });

      // users.service.ts에서 user.email, verification.code에서 email과 code를 string으로 call한다고 작성한다.
      expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        // email
        expect.any(String),
        // code
        // Received: "dowon@email.com", "code" Number of calls: 1
        // expect.any(Object),
        expect.any(String),
      );
      expect(result).toEqual({ ok: true });
    });

    it('예외가 발생하면 실패하게 한다', async () => {
      // findOne은 reject한다. users.service.ts에서 exists await이 fail하게 되어 catch 칸으로 이동하게 된다.
      // 즉, createAccount가 { ok: false, error: '계정을 생성할 수 없습니다.' }와 동일하다.
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.createAccount(createAccountArgs);
      // result log = { ok: false, error: '계정을 생성할 수 없습니다.' }
      // console.log(result);
      expect(result).toEqual({
        ok: false,
        error: '계정을 생성할 수 없습니다.',
      });
    });
  });
  describe('login', () => {
    const loginArgs = {
      email: 'dowon@email.com',
      password: 'dowon.paasword',
    };
    it('사용자가 존재하지 않으면 실패하게 한다.', async () => {
      // null = doesn't exist
      usersRepository.findOne.mockResolvedValue(null);

      const result = await service.login(loginArgs);
      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
      );
      expect(result).toEqual({
        ok: false,
        error: '사용자를 찾을 수 없습니다.',
      });
    });
    it('비밀번호가 틀리면 실패하게 한다.', async () => {
      // users.findOne return value를 mock한다.
      const mockedUser = {
        id: 1,
        // mockResolvedValue와 같이 Promise를 return하는 mock function이다.
        // await mockedUser.checkPassword call -> true가 나온다.
        // fn = Creates a mock function. Optionally takes a mock implementation.
        checkPassword: jest.fn(() => Promise.resolve(false)), // true -> false로 패스워드 틀리다고 변경
      };
      // if(!user)는 실행되지 않고, passwordCorrect가 실행된다.
      usersRepository.findOne.mockResolvedValue(mockedUser);
      const result = await service.login(loginArgs);
      // result log = { ok: false, error: '잘못된 비밀번호입니다.' }
      // console.log(result);
      expect(result).toEqual({
        ok: false,
        error: '잘못된 비밀번호입니다.',
      });
    });
    // user.id로 token을 sign, get 해야 한다.
    it('패스워드가 일치하면 토큰을 통과하게 한다.', async () => {
      const mockedUser = {
        id: 1,
        // Received number of calls: 0 에러메시지 발생 시 Promise.resolve(true))로 작성
        checkPassword: jest.fn(() => Promise.resolve(true)), // false -> true로 패스워드 맞다고 변경
      };
      usersRepository.findOne.mockResolvedValue(mockedUser);
      const result = await service.login(loginArgs);
      // result log = { ok: true, token: 'signed-token-omg' }
      // console.log(result);
      // expect를 사용해서 jwtService user.id를 Number와 함께 call한다.
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(expect.any(Number));
      expect(result).toEqual({ ok: true, token: 'signed-token-omg' });
    });
    it('예외가 발생하면 실패하게 한다', async () => {
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.login(loginArgs);
      // result log = { ok: false, error: '로그인을 할 수 없습니다.' }
      // console.log(result);
      expect(result).toEqual({ ok: false, error: '로그인을 할 수 없습니다.' });
    });
  });
  describe('findById', () => {
    const findByIdArgs = { id: 1 };
    it('사용자가 존재하면 찾게하게 한다.', async () => {
      usersRepository.findOneOrFail.mockResolvedValue(findByIdArgs);
      const result = await service.findById(1);
      expect(result).toEqual({ ok: true, user: findByIdArgs });
    });
    it('사용자를 찾지 못하면 실패하게 한다.', async () => {
      usersRepository.findOneOrFail.mockRejectedValue(new Error());
      const result = await service.findById(1);
      expect(result).toEqual({
        ok: false,
        error: '사용자를 찾을 수 없습니다.',
      });
    });
  });
  describe('editProfile', () => {
    it('이메일을 변경하게 한다.', async () => {
      // oldUser
      const oldUser = {
        email: 'dowon@old.com',
        verified: true,
      };
      const editProfileArgs = {
        userId: 1,
        input: { email: 'dowon@new.com' },
      };
      const newVerification = {
        code: 'code',
      };
      // newUser
      const newUser = {
        // shold be called updated user, new enail, verification false
        verified: false,
        email: editProfileArgs.input.email,
      };

      // oldUser를 return한다.
      usersRepository.findOne.mockResolvedValue(oldUser);
      // create는 promise를 return하지 않는다. 그러므로 mockReturnValue를 사용했다.
      verificationRepository.create.mockReturnValue(newVerification);
      // save는 promise를 return한다. 그러므로 mockResolvedValue를 사용한다.
      verificationRepository.save.mockResolvedValue(newVerification);

      await service.editProfile(editProfileArgs.userId, editProfileArgs.input);
      // findOne(userId) call 확인
      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith(
        editProfileArgs.userId,
      );
      // "user": Object {} newUser -> {user: newUser}  this.verifications.create({ user }),
      expect(verificationRepository.create).toHaveBeenCalledWith({
        user: newUser,
      });
      // "user": Object {} newUser -> {user: newUser}  this.verifications.create({ user }),
      expect(verificationRepository.save).toHaveBeenCalledWith(newVerification);

      expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
      // sendVerificationEmail shold be called new email, code
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        // this.mailService.sendVerificationEmail(user.email, verification.code);
        //Expected: "fdsffd", "code" Received1: "dowon@email.com", "code" 2: "dowon@new.com", "code"
        //'fdsffd',
        newUser.email,
        newVerification.code,
      );
    });
    it('비밀번호를 변경하게 한다.', async () => {
      const editProfileArgs = {
        userId: 1,
        input: { password: 'new.password' },
      };
      // old password checking
      usersRepository.findOne.mockResolvedValue({ password: 'old' });
      const result = await service.editProfile(
        editProfileArgs.userId,
        editProfileArgs.input,
      );
      // await this.users.save(user);
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      // - "password": "old", + "password": "new.password",
      // expect(usersRepository.save).toHaveBeenCalledWith({ password: 'old' });
      // new password checking
      expect(usersRepository.save).toHaveBeenCalledWith(editProfileArgs.input);
      expect(result).toEqual({ ok: true });
    });
    it('예외가 발생하면 실패하게 한다.', async () => {
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.editProfile(1, { email: '12' });
      expect(result).toEqual({
        ok: false,
        error: '프로필을 업데이트 할 수 없습니다.',
      });
    });
  });
  describe('verifyEmail', () => {
    it('이메일을 인증하게 한다.', async () => {
      // verification need .user, .id
      const mockVerification = {
        user: {
          verified: false,
        },
        id: 1,
      };
      verificationRepository.findOne.mockResolvedValue(mockVerification);
      const result = await service.verifyEmail('');
      expect(verificationRepository.findOne).toHaveBeenCalledTimes(1);
      // { code }, { relations: ['user'] } = 2 object
      expect(verificationRepository.findOne).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
      );
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      // verified = true -> false
      expect(usersRepository.save).toHaveBeenCalledWith({ verified: true });
      expect(verificationRepository.delete).toHaveBeenCalledTimes(1);
      expect(verificationRepository.delete).toHaveBeenCalledWith(
        mockVerification.id,
      );
      expect(result).toEqual({ ok: true });
    });
    it('인증을 찾지 못하면 실패하게 한다.', async () => {
      // findOne을 null -> null return을 mock한다.
      verificationRepository.findOne.mockResolvedValue(undefined);
      const result = await service.verifyEmail('');
      expect(result).toEqual({ ok: false, error: '인증을 찾을 수 없습니다.' });
    });
    it('예외가 발생하면 실패하게 한다.', async () => {
      verificationRepository.findOne.mockRejectedValue(new Error());
      const result = await service.verifyEmail('');
      expect(result).toEqual({ ok: false, error: '인증하지 못했습니다.' });
    });
  });
});
