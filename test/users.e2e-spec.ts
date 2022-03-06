import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection } from 'typeorm';

describe('UserModule (e2e)', () => {
  let app: INestApplication;
  // beforeEach 각각 -> beforeAll 모든 test 전에 module을 load
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    // after all the test connect, drop database
    await getConnection().dropDatabase();
    await app.close();
  });
  it.todo('createAccount');
  it.todo('userProfile');
  it.todo('login');
  it.todo('me');
  it.todo('verifyEmail');
  it.todo('hi');
  it.todo('editProfile');
});
