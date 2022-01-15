import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { User } from './entities/users.entity';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly config: ConfigService,
  ) {
    console.log(this.config.get('SECRET_KEY'));
  }

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

  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    try {
      // email을 가진 user를 찾는다(find).
      const user = await this.users.findOne({ email });
      // user가 존재하지 않는다면
      if (!user) {
        return {
          ok: false,
          error: '사용자를 찾을 수 없습니다.',
        };
      }
      // password가 맞는지 확인(check)한다.
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: '잘못된 비밀번호입니다.',
        };
      }
      // 누구든 token을 못보게 user ID만 넣어준다.
      // process.env.SECRET_KEY로 해도 괜찮지만, nethjs 방식이 아니다.
      const token = jwt.sign({ id: user.id }, this.config.get('SECRET_KEY'));
      return {
        ok: true,
        token: 'lalalala',
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
    // JWT를 만들고 user에게 준다(give).
  }
}
