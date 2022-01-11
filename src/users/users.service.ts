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

  async createAccount({
    email,
    password,
    role,
  }: createAccountInput): Promise<{ ok: boolean; error?: string }> {
    try {
      // email을 가지고 있는 지 확인
      const exists = await this.users.findOne({ email });
      // user가 존재한다면, string을 return한다.
      if (exists) {
        return {
          ok: false,
          error: '해당 이메일을 가진 사용자가 이미 존재합니다.',
        };
      }
      // else면 아무것도 return 하지 않는다.
      // 인스턴스를 만들고 난 뒤 user를 동시에 저장(save)한다.
      await this.users.save(this.users.create({ email, password, role }));
      return { ok: true };
    } catch (e) {
      // 에러가 있으면 string을 return한다.
      return { ok: false, error: '계정을 생성할 수 없습니다.' };
    }
  }
}