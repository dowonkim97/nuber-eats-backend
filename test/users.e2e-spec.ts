import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
// if Type 'typeof supertest' has no call signatures error import request from 'supertest';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection } from 'typeorm';

// posting /graphql url
const GRAPHQL_ENDPOINT = '/graphql';

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

  // resolver, service, typeorm working test
  describe('createAccount', () => {
    const EMAIL = 'won@won.com';
    it('계정을 생성하게 한다.', () => {
      // using supertest
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          // send data
          // user, verification table create and then goes away
          query: `mutation {
            createAccount(input: {
              email: "${EMAIL}",
              password:"12345",
              role: Owner,
            }) {
              ok
              error
            }
          }`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(true);
          expect(res.body.data.createAccount.error).toBe(null);
        });
    });
  });
  it.todo('userProfile');
  it.todo('login');
  it.todo('me');
  it.todo('verifyEmail');
  it.todo('hi');
  it.todo('editProfile');
});
