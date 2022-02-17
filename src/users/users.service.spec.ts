import { Test } from '@nestjs/testing';
import { UserService } from '../users/users.service';

describe('UserService', () => {
  let service: UserService;

  beforeAll(async () => {
    // testing module을 만든다.
    const module = await Test.createTestingModule({
      providers: [UserService],
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
