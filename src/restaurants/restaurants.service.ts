import { Injectable } from '@nestjs/common';

@Injectable()
export class RestaurantService {
  getAll() {
    return; //실제로 DB에 접근하는 방식
  }
}
