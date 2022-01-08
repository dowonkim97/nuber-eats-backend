import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createAccountInput } from './dtos/create-account.dto';
import { User } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({ email, password, role }: createAccountInput) {
    try {
      const exists = await this.users.findOne({ email });
      // 새로운 user인지 확인
      if (exists) {
        // 에러 만들기.
        return;
      }
      await this.users.save(this.users.create({ email, password, role }));
      // 새로운 user을 만듦 동시에 저장
      return true;
    } catch (e) {
      return;
    }
  }
}
