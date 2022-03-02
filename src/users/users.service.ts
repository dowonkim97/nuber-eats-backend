import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  createAccountInput,
  createAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/users.entity';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-Profile.dto';
import { Verification } from './entities/verification.entity';
import { VerifyEmailOutput } from './dtos/verify-email.dto';
import { UserProfileOutput } from './dtos/user-profile.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}
  // create account
  async createAccount({
    email,
    password,
    role,
  }: //  }: createAccountInput): Promise<{ ok: boolean; error?: string }> {
  createAccountInput): Promise<createAccountOutput> {
    try {
      // email을 가지고 있는 지 확인
      // createAccount는 테스트 할 때 this.users.findOne에 의존한다.
      const exists = await this.users.findOne({ email });
      // console.log(exists)로 createAccount를 테스트 한다.
      // console.log(exists);
      // user가 존재한다면, string을 return한다.
      if (exists) {
        // return {}을 테스트 한 결과 console.log { id: 1, email: 'lalal' } 가 출력된다.
        return {
          ok: false,
          error: '해당 이메일을 가진 사용자가 이미 존재합니다.',
        };
      }
      // else면 아무것도 return 하지 않는다.
      // 인스턴스를 만들고 난 뒤 user를 동시에 저장(save)한다.
      // create한 것을 user에 가져온다.
      // createAccount는 테스트 할 때 this.users.save에 의존한다.
      const user = await this.users.save(
        this.users.create({ email, password, role }),
      );

      // verification 생성
      // createAccount는 테스트 할 때 this.verifications.save에 의존한다.
      const verification = await this.verifications.save(
        this.verifications.create({
          // user를 create하고 save하고 있음
          user,
        }),
      );
      // sendVerification 사용할 수 있게 추가
      this.mailService.sendVerificationEmail(user.email, verification.code);
      return { ok: true };
    } catch (error) {
      // 에러가 있으면 string을 return한다.
      return { ok: false, error: '계정을 생성할 수 없습니다.' };
    }
  }
  // login
  async login({
    email,
    password,
  }: // }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
  LoginInput): Promise<LoginOutput> {
    try {
      // email을 가진 user를 찾는다(find).
      const user = await this.users.findOne(
        { email },
        { select: ['id', 'password'] },
      );
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
      // console.log(user);

      // 누구든 token을 못보게 user ID만 넣어준다.
      // process.env.SECRET_KEY로 해도 괜찮지만, nethjs 방식이 아니다.
      const token = this.jwtService.sign(user.id);
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error: '로그인을 할 수 없습니다.',
      };
    }
  }
  async findById(id: number): Promise<UserProfileOutput> {
    try {
      // findOne -> findOneOrFail로 변경,findOneOrFail은 exception 처리 즉, error를 throw함.
      const user = await this.users.findOneOrFail({ id });
      // if (user) {
      return {
        ok: true,
        user: user,
      };
      // }
    } catch (error) {
      // user 못 찾으면 여기로 보냄
      return {
        ok: false,
        error: '사용자를 찾을 수 없습니다.',
      };
    }
  }

  // editProfile에도 verification 생성 가능하게 함
  async editProfile(
    // editProfile할 때, userId를 보내야 한다.
    userId: number,
    { email, password }: EditProfileInput,
  ): //   ): Promise<User> {
  Promise<EditProfileOutput> {
    try {
      // oldUser
      const user = await this.users.findOne(userId);
      if (email) {
        // newUser
        // user email이 변경되면
        user.email = email;
        // user는 verified 되지 않은 상태가 된다.
        user.verified = false;
        // verification 생성
        // user를 create하고 save하고 있음
        // verification 과 sendVerificationEmail 추가
        const verification = await this.verifications.save(
          this.verifications.create({ user }),
        );
        this.mailService.sendVerificationEmail(user.email, verification.code);
      }
      if (password) {
        user.password = password;
      }
      await this.users.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error: '프로필을 업데이트 할 수 없습니다.' };
    }
  }
  // service도 resolver처럼 output을 공유한다.
  // async verifyEmail(code: string): Promise<boolean> {
  async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    // verification을 찾는다.
    try {
      const verification = await this.verifications.findOne(
        { code },
        //{ loadRelationIds: true } console user: 5 } 5
        { relations: ['user'] }, // 통째로 받아오는 방법이고, 늘 user를 가져온다.
      );
      if (verification) {
        // verification.user는 undefined
        // TypeORM default로 relationship을 불러오지 않는다.
        // console.log(verification);
        // 존재하면 삭제하고, 연결된 user의 verification을 verified true로 바꾼다.
        verification.user.verified = true;
        // console.log(verification.user);
        // verification이 있으면 유저 인증됨.
        await this.users.save(verification.user);
        // 사용자 당 하나의 인증서만 가질 수 있고, 인증서당 하나의 유저만 가질 수 있기 때문에 verification 삭제해준다.
        await this.verifications.delete(verification.id);
        // return true;
        return { ok: true };
      }
      // throw new Error();
      return { ok: false, error: '인증을 찾지 못했습니다.' };
    } catch (error) {
      return { ok: false, error: '인증하지 못했습니다.' };
    }
  }
}
