import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-resturant.dto';
import { Restaurant } from './entities/restaurants.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
  ) {}
  /*   
    getAll(): Promise<Restaurant[]> {
    return this.restaurants.find(); //실제로 DB에 접근하는 방식
  } 
  */
  async createRestaurant(
    // User인 owner가 need createRestaurant service
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.restaurants.create(createRestaurantInput);
      await this.restaurants.save(newRestaurant);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '레스토랑을 만들 수 없습니다.',
      };
    }
  }
  /*   
    updateRestaurant({ id, data }: UpdateRestaurantDto) {
    this.restaurants.update(id, { ...data });
  } 
  */
}
