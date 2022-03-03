import { Test } from '@nestjs/testing';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { JwtService } from './jwt.service';

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
  it.todo('sign');
  it.todo('verify');
});
