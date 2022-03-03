import { Test } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { JwtService } from './jwt.service';

// jsonwebtoken mock
jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn(() => 'TOKEN'),
  };
});
const TEST_KEY = 'testKey';
describe('JwtService', () => {
  let service: JwtService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      //  CONFIG_OPTIONS at index [0] is available in the RootTestModule context.
      providers: [
        JwtService,
        {
          provide: CONFIG_OPTIONS,
          useValue: { privateKey: TEST_KEY },
        },
      ],
    }).compile();
    service = module.get<JwtService>(JwtService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('sign', () => {
    it('서명된 토큰을 반환하게 한다.', () => {
      const ID = 1;
      // { id: userId }, this.options.privateKey;
      const token = service.sign(ID);
      // service.sign return value check
      expect(typeof token).toBe('string');
      // console.log(token); <= result = eyJh~~~ -> TOKEN
      // console.log(jwt.sign({ id: 1 }, 'lalalaaa')); <= jsonwebtoken mock replace, result = TOKEN
      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: ID,
        },
        TEST_KEY,
      );
    });
  });
  describe('verify', () => {
    it('해독된 토큰을 반환하게 한다.', () => {});
  });
});
