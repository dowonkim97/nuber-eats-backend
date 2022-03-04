import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { kill } from 'process';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurants.entity';
import { RestaurantService } from './restaurants.service';

const mockRepository = () => ({
  find: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('RestaurantService', () => {
  let service: RestaurantService;
  let restaurantsRepository: MockRepository<Restaurant>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RestaurantService,
        { provide: getRepositoryToken(Restaurant), useValue: mockRepository() },
      ],
    }).compile();
    service = module.get<RestaurantService>(RestaurantService);
    restaurantsRepository = module.get(getRepositoryToken(Restaurant));
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getAll', () => {
    it('아이디를 찾게 한다.', async () => {
      restaurantsRepository.find.mockResolvedValue({
        id: 1,
      });
      const result = await service.getAll();
      expect(result).toMatchObject({
        id: 1,
      });
    });
    describe('createRestaurant', () => {
      const restaurantArgs = {
        name: 'kim',
        isVegan: true,
        address: '123',
      };
      it('레스토랑을 만들게 한다.', async () => {
        restaurantsRepository.create.mockResolvedValue(restaurantArgs);
        restaurantsRepository.save.mockResolvedValue(restaurantArgs);
        const result = await service.createRestaurant(restaurantArgs);
        expect(result).toMatchObject(restaurantArgs);
      });
    });
    describe('updateRestaurant', () => {
      it('레스토랑을 업데이트 한다.', async () => {
        const oldUser = {
          id: 0,
          data: null,
        };
        const newUser = {
          id: 1,
          data: null,
        };
        restaurantsRepository.update.mockResolvedValue(oldUser);
        const result = await service.updateRestaurant(newUser);
        expect(result).not.toBe(newUser);
      });
    });
  });
});
