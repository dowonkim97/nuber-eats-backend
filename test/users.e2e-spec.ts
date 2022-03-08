import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
// if Type 'typeof supertest' has no call signatures error import request from 'supertest';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection, Repository } from 'typeorm';
import { User } from 'src/users/entities/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

jest.mock('got', () => {
  return {
    post: jest.fn(),
  };
});

// posting /graphql url
const GRAPHQL_ENDPOINT = '/graphql';
const testUser = {
  email: 'won@won.com',
  password: '12345',
};

describe('UserModule (e2e)', () => {
  const graphqlRequest = (query: string) =>
    request(app.getHttpServer()).post(GRAPHQL_ENDPOINT).send({ query });
  let app: INestApplication;
  let usersRepository: Repository<User>;
  // share token
  let jwtToken: string;

  // beforeEach 각각 -> beforeAll 모든 test 전에 module을 load
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    // <Repository<User>> type
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    await app.init();
  });

  afterAll(async () => {
    // after all the test connect, drop database
    await getConnection().dropDatabase();
    await app.close();
  });

  // resolver, service, typeorm working test
  describe('createAccount', () => {
    it('계정을 생성하게 한다.', () => {
      // using supertest
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          // send data
          // user, verification table create and then goes away
          query: `mutation {
            createAccount(input: {
              email: "${testUser.email}",
              password:"${testUser.password}",
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
    it('계정이 이미 존재하면 실패하게 한다.', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          // send data
          // user, verification table create and then goes away
          query: `mutation {
            createAccount(input: {
              email: "${testUser.email}",
              password:"${testUser.password}",
              role: Owner,
            }) {
              ok
              error
            }
          }`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(false);
          // If it should pass with deep equality, replace "toBe" with "toStrictEqual"    Expected: Any<String>, Received: "해당 이메일을 가진 사용자가 이미 존재합니다."
          expect(res.body.data.createAccount.error).toEqual(expect.any(String));
          // toBe는 정확한 메시지 입력해야 한다.
          expect(res.body.data.createAccount.error).toBe(
            '해당 이메일을 가진 사용자가 이미 존재합니다.',
          );
        });
    });
  });
  // at userProfile resolver, to be able login state -> see profile
  describe('login', () => {
    // it("should get token")
    it('정확한 자격 증명(correct credentials)과 함께 로그인 하게 한다.', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `mutation {
          login(input:{
            email: "${testUser.email}",
            password:"${testUser.password}",
          }) {
          ok
          error
          token
          }
        }`,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;
          console.log(res);
          expect(login.ok).toBe(true);
          expect(login.error).toBe(null);
          expect(login.token).toEqual(expect.any(String));
          // update token, using the token later, do not use const token reason won't be able access token, outside variable
          jwtToken = login.token;
        });
    });
    // it("should not get token")
    it('잘못된 자격 증명(wrong credentials)과 함께 로그인 할 수 없습니다.', () => {
      return graphqlRequest(
        `mutation {
        login(input:{
          email: "${testUser.email}",
          password:"xxxxx",
        }) {
        ok
        error
        token
        }
      }`,
      )
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;
          // text: '{"data":{"login":{"ok":true,"error":null,"token":"eyJh~"}}}\n',
          // console.log(res);
          expect(login.ok).toBe(false);
          // expect(login.error).toBe('alal') = Expected: "alal", Received: "잘못된 비밀번호입니다."
          expect(login.error).toBe('잘못된 비밀번호입니다.');
          expect(login.token).toBe(null);
        });
    });
  });
  // userProfile think need user, found out id, userId
  describe('userProfile', () => {
    let userId: number;
    // beforeAll the test inside of userProfile
    beforeAll(async () => {
      // this will take out first element the array inside a variable called user
      // console.log(await usersRepository.find());
      const [user] = await usersRepository.find();
      // const userId not going to work
      userId = user.id;
    });
    // may not be used in a describe block containing no tests.
    it('사용자 프로필을 볼 수 있어야 한다.', () => {
      return (
        request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          // header set
          .set(`X-JWT`, jwtToken)
          .send({
            query: `
        {
          userProfile(userId:${userId}) {
            error
            ok
            user {
              id
            }
          }
        }
        `,
          })
          .expect(200)
          .expect((res) => {
            const {
              body: {
                data: {
                  userProfile: {
                    ok,
                    error,
                    user: { id },
                  },
                },
              },
            } = res;
            // { data: { userProfile: { error: null, ok: true, user: [Object] } } }
            // console.log(res.body);
            expect(ok).toBe(true);
            expect(error).toBe(null);
            expect(id).toBe(userId);
          })
      );
    });
    it('프로필을 찾을 수 없습니다.', () => {
      return (
        request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          // header set
          .set(`X-JWT`, jwtToken)
          // userId dosn't exist
          .send({
            query: `
      {
        userProfile(userId: 999) {
          error
          ok
          user {
            id
          }
        }
      }
      `,
          })
          .expect(200)
          .expect((res) => {
            const {
              body: {
                data: {
                  userProfile: { ok, error, user },
                },
              },
            } = res;
            // { data: { userProfile: { error: null, ok: true, user: [Object] } } }
            // console.log(res.body);
            expect(ok).toBe(false);
            expect(error).toBe('사용자를 찾을 수 없습니다.');
            expect(user).toBe(null);
          })
      );
    });
  });
  it.todo('me');
  it.todo('verifyEmail');
  it.todo('hi');
  it.todo('editProfile');
});
