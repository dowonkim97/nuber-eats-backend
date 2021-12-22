# NUBER-EATS-BACKEND

- 나에게 주는 교훈
  다른 사람들보다 시간이 많이 걸리더라도 완벽히 스스로 알자
  모작가가 아닌 창작가가 되자.

- 주의사항
  코드를 무작정 다 따라하지 않아야 한다.
  내가 직접 코드를 짜볼 수 있어야한다.
  따라만해서는 절대 실력이 늘지 않고, 자신의 실력이 아니다.

- 해결방법
  다른 하나의 nest README에서는 직접 배운 것들을 기록한다.
  다른 하나의 nest 폴더에서는 private로 진행한다.
  다른 하나의 nest는 직접 배운 코드를 다르게 짜본다.

# 강의에서 배운 것들만 기록

# #0.6

- nest (cmd)
- nest g application (cmd)
- cd nuber-eats-backend (cmd)
- ✅ dir 윈도우 | ls 리눅스, 맥
- code . (vscode 실행 명령어)

---

- npm i (vscode 터미널)
- npm run start:dev (vscode 터미널)
- http://localhost:3000 (Hello World! 출력)

- github.com/new (새로운 repository 생성)
- git init(vscode 터미널)
- git remote add origin https://github.com/dowonkim97/nuber-eats-backend

- gitignore (확장프로그램 이미 설치됨)
- 명령 팔레트 (윈도우 기준 ctrl + shift + P)
- > Add gitignore (명령 팔레트)
- node (명령 팔레트)

- git add . (vscode 터미널)
- git commit -m "#0.6" (vscode 터미널)

# #1.0

- https://docs.nestjs.com/graphql/quick-start (internet 검색)
- npm i @nestjs/graphql graphql@^15 apollo-server-express (vscode 터미널)
- npm i apollo-server-core (vscode 터미널)
- app.module은 main.ts로 import되는 유일한 모듈이다.

- Code first와 Schema first 두 옵션이 있다.
- Schema first는 기본적으로 forRoot가 주어진다.
  .graphql 파일을 작성해야 해야 한다. (.typescript 파일도 만들어야 한다.)
  번거롭기 때문에 Code first로 진행한다.
- Code first는 자동으로 schema를 생성한다.

- Error: Apollo Server requires either an existing schema, modules or typeDefs
- https://docs.nestjs.com/graphql/quick-start#code-first
- app.module.ts forRoot안에
  "autoSchemaFile: join(process.cwd(), 'src/schema.gql'),"
  를 넣는다. join import 해준다.
- nest g mo restaurants
  모듈을 만들어준다.

- restaurants.module.ts에는 @Module에 providers: [RestaurantsResolver],
  를 넣어줘야 한다. 그렇지 않으면 Query root type must be provided. 에러가 발생한다.

- restaurants.resolver 생성하고 @Resolver
  '@nestjs/graphql'에서 자동으로 가져오기

```
      'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto',
            },
        ],
```

- 매번 추가해줘야 할 것 같다.
- @Query는 graphql을 import 해야 한다.
  (첫번째 arg = (), returns => Boolean / typeFunc: ReturnTypeFunc, options?: QueryOptions) typeFunc을 받는다.
  @Query는 Boolean을 return(반환)해준다.

```
'@typescript-eslint/no-unused-vars': 'off',
'@typescript-eslint/ban-types': 'off',
```

- Boolean 에러가 발생하여 .eslintrc에 추가하였다.

- yarn start하면 schema.gql파일이 생성된다.
- join(process.cwd(), 'src/schema.gql') -> true로 변경한다.
  직접 가지고 있지 않아도 되기 때문이다.
- http://localhost:3000/graphql

# #1.2

- 객체타입(object types)
- restaurants에 entities 폴더와 restaurants.entity.ts 파일 생성
- @ObjectType 입력

```
// graphql 위한 Boolean은 지우면 안됨
  @Query((returns) => Boolean)
  // typescript 위한 Boolean 지워도 상관없음
  isGoodKimchi(): Boolean {
    return true;
  }
```

- restaurants.resolver.ts 에서 삭제

- nullable은 값형식의 데이터 타입에 Null 값을 넣을수 있도록 해주는 것이다.
- isGood은 nullable이기 때문에 null이 가능하다. 그렇기 떄문에
  http://localhost:3000/graphql DOCS에서 Boolean에 !가 없다.

```
{
  myRestaurant {
    isGood
  }
}
```

```
{
  "data": {
    "myRestaurant": {
      "isGood": null
    }
  }
}
```

```
{
  myRestaurant {
    name
  }
}
```

```
{
  "errors": [
    {
      "message": "Cannot return null for non-nullable field Restaurant.name.",
      "locations": [
        {
          "line": 3,
          "column": 5
        }
      ],
      "path": [
        "myRestaurant",
        "name"
      ],
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR",
        "exception": {
        }
      }
    }
  ],
  "data": null
}
```

- name에서 에러가 발생한다.

- 소문자 boolean Primitive Boolean
- 대문자 Boolean object wrapper

```
let isDone: boolean = false
typeof isDone === 'boolean' // true
let isOk: Boolean = true
let isNotOk: boolean = new Boolean(true)
```

- 위처럼 생성 방식에 차이가 있고 기본적으로 타입스크립트는 소문자를 씁니다.
  GraphQL 데코레이터는 대문자를 요구합니다.
- entity는 typeDefs와 유사하다.

# #1.3

```
myRestaurant() {
    return true;
  }
```

- restaurants.resolver.ts에서 삭제 변경했다.
- GraphQL에서 아래와 같이 입력한다.

```
{
  restaurants(veganOnly: true) {
    name
  }
}
```

```
"message": "Unknown argument \"veganOnly\" on field \"Query.restaurants\".",
```

- 이렇듯 에러가 발생한다. 그러므로 argument(@Arg)에 직접 요청해야 한다.
- http://localhost:3000/graphql DOCS arguments veganOnly: Boolean!

- console.log(veganOnly) console 찍어서 확인해보면 true 값이 나온다.

# #1.4

- 용어 Argument 함수의 변수에 집어넣는 값(입력값)

- @Mutation 생성
- restaurants.resolver.ts에서 createRestaurant(): boolean return을
  true로 해준다.
- http://localhost:3000/graphql DOCS mutations createRestaurant: Boolean!
- restaurants.entity.ts에 isGood 제거하고,
  isVegan, address, ownerName @Field 추가
- restaurants.resolver.ts createRestaurant() 안에
  @Arg name, isVegan, address, ownerName 넣는다.
- inputType을 @Args 한개씩이 아니라 class 전체를 전달할 수 있다.
  일종의 DTO 같다.
- restaurants에 dtos 폴더를 생성, create-resturant.dto.ts 파일 생성
- @InputType()과 export class createRestaurantDto 만들고,
  @Field에 (type => String or Boolean)
  name, isVegan, address, ownerName에 string or boolean을 넣는다.
- restaurants.resolver.ts createRestaurant() 괄호안에
  @Args() createRestaurantInput: createRestaurantDto가 arguments가 된다.

```
mutation {
  createRestaurant(createRestaurantInput: {
    name:""
  })
}
```

- 이렇게 작성하는 것이 별로다.
- restaurants.resolver.ts에서 @Args() 괄호 안에 'createRestaurantInput'를
  없앨 수 있지만 에러가 발생한다. argument로써 이름을 가지고 있지 않으면 InputType을 사용할 수 없다.
- 그렇기 때문에 create-resturant.dto.ts에서
  InputType에서 ArgsType으로 바꾼다.

- @ArgsType은 분리된 argument로 정의할 수 있게 해준다.
  하나의 object에 모든 것을 담지 않고,
  분리된 값들을 GraphQL argument 전달해줄 수 있도록 해준다.
- ArgsType 사용⭕

```
  a(
    @Args() a:ADto,
  ): boolean {
    return: true;
  }

```

- @InputType은 하나의 object, object를 전달해야 한다.
  argument로써 graphql로 전달하기 위한 용도이다.
- InputType 사용❌

  ```
  a(
    @Args('kim') kim:string,
    @Args('do') do:string,
    @Args('won') won:string,
  ): boolean {
    return: true;
  }
  ```

- InputType 사용⭕

```
  a(
    @Args('a') a:ADto,
  ): boolean {
    return: true;
  }
```

- InputType과 ArgsType 다른점은 ArgsType은 이름을 쓰지 않아도 되고, object로 넘어오지 않는다. object로 넘어오지 않는다는 뜻은 @Args() 괄호 안에
  인자 ''가 넘어가지 않는다.

- restaurants.resolver.ts input을 Dto로 바꾼다.

- @Args('name') name: string 이런식으로 많은 resolver를 작성해줘야
  해서 번거로운 방법이었고, InputType은 graphql에서 name: "" 같은
  object를 많이 전달해줘야 해서 번거로운 방법이었기 때문에
  ArgsType으로 변경해주면 이러한 수고로움을 겪지 않아도 된다.
  class CreateRestaurantDto에 모든 것을 관리할 수 있는
  ArgsType이 제일 좋은 방법인 것 같다.
  그리고 이 방식을 사용하면 class의 유효성검사도 할 수 있다.

# #1.5

```
 npm i class-validator
```

- create-resturant.dto.ts에서
  name은 @Length @IsString
  address, ownerName은 @IsString
  isVegan은 @IsBoolean으로 class 유효성 검사한다.

- http://localhost:3000/graphql에서 최대길이를 테스트하기 위해 입력한다.

- 5~10 안에 들어오는 경우

```
 mutation {
  createRestaurant(
  name:"12",
  address:"123213",
  isVegan:true,
  ownerName: "kim"
  )
  }
```

```
{
  "data": {
    "createRestaurant": true
  }
}
```

- 5~10이 최대 길이인데, 통과하였다. 왜냐하면 validation-pipeline을 만들지 않았다.
- main.ts에서

```
app.useGlobalPipes( new ValidationPipe());
```

- class-transformer를 설치하지 않아도 class-validator가 작동했다.
  그래도 혹시 모르니까 class-transformer를 설치해준다.

```
npm i class-transformer
```

- 4글자 짧은 에러

```
mutation {
  createRestaurant(
    name:"1342",
    address:"123213",
    isVegan:true,
    ownerName: "kim"
  )
}
```

```
  "response": {
          "statusCode": 400,
          "message": [
            "name must be longer than or equal to 5 characters"
          ],
          "error": "Bad Request"
        }
```

- 16글자 길은 에러

```
mutation {
  createRestaurant(
    name:"1123213213213342",
    address:"123213",
    isVegan:true,
    ownerName: "kim"
  )
}

```

```
 "response": {
          "statusCode": 400,
          "message": [
            "name must be shorter than or equal to 10 characters"
          ],
          "error": "Bad Request"
        }
```

- 콘솔 결과

```
mutation {
  createRestaurant(
    name:"1123212",
    address:"123213",
    isVegan:true,
    ownerName: "kim"
  )
}

```

```
{ name: '1123212', isVegan: true, address: '123213', ownerName: 'kim' }
```

# #2.0

- 타입스크립트, NestJS 데이터베이스
  통신을 위해 사용하면 편리한 ORM이 필요하다
  직접 SQL로 보내는 것보다 TYPE ORM(객체 관계 매칭)을 사용하면 타입스크립트의 좋은 점을 이용할 수 있다.
  type과 NestJS와 연계할 수 있다.
  데이터베이스 상호작용을 테스트할 수도 있다.
- https://typeorm.io/#/supported-platforms
  NodeJS, Browser 등 사용법이 나와있다.
  Browser에서도 사용할 수 있다는 뜻은 웹에서 SQL 같은 것을 사용한다는 뜻이다.
  sql-wasm.wasm은 웹 어셈블리라는 뜻이다.
  Connection Options # Common connection options에서
  "mysql", "postgres", "cockroachdb", "mariadb", "sqlite" 중에서 "postgres"를 사용하기 때문에
  다운로드 해준다. postgres는 데이터를 시각화해준다.
- https://www.postgresql.org/download/ windows 사용자 ✅
- https://postgresapp.com/ mac 사용자
- https://eggerapps.at/postico/
  postgresql GUI mac 사용자
- https://www.pgadmin.org/ windows 사용자 ✅

# 2.1 mac skip

# #2.2

- 서버 create에서 pgadmin에서 name을 임의로 설정하고,
  Connection에서 Host name/adress에서
  localhost로 설정한다.
- Database nuber-eats를 생성한다. 유저 비밀번호를 만든다.
- pgAdmin는 항상 켜놓는 게 아니고,
  postgreSQL을 항상 켜놓는 것이다.
- PostgreSQL에 대한 정보는
  http://www.devkuma.com/books/16에 잘 나와있는 것 같다.

# #2.3

- https://docs.nestjs.com/techniques/database
  NestJS @nestjs/typeorm 및 다른 ORM 패키지인
  @nestjs/sequelize를 사용해도 된다.
  mongodb를 사용해도 된다.
- typeORM는 타입스크립트에 기반 (멀티 플랫폼)
  NODEJS뿐만 아니라 REACT NATIVE에도 작동한다
- Sequelize는 자바스크립트에 기반 (타입스크립트 1%)
  NODEJS만 작동한다.
- https://docs.nestjs.com/techniques/database

```
npm install --save @nestjs/typeorm typeorm pg
```

- typeORM 모듈을 app.module.ts에 설치해준다.

```
@Module import TypeOrmModule.forRoot({})
```

괄호안에 options?: TypeOrmModuleOptions을 https://github.com/typeorm/typeorm를 참조해서 아래와 같이 집어 넣는다

```
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '12345',
      database: 'nuber-eats',
      synchronize: true,
      logging: true,
```

- localhost이면 패스워드를 물어보지 않게 되어있다.
- synchronize는 TypeORM이 데이터베이스를 연결할 떄
  모듈을 현재상태로 마이그레이션한다.
- 마이그레이션이란 운영환경에서 좀 더 낫다고 생각하는
  다른 운영환경으로 옮겨가는 과정을 뜻한다.
- logging은 콘솔에 기록하는 것이다.
  true로 설정했지만 나중에 바꾼다.

```
npm run start:dev
```

# #2.4

- https://www.npmjs.com/package/dotenv
  dotenv .env파일에서 환경변수를 로드하는 방식도 있지만,
  NestJS는 configuration 모듈을 가지고 있다.
  https://docs.nestjs.com/techniques/configuration에서 설치해준다.
  환경에 구성 변수를 저장하는 것(to store configuration variables in the environment.)이다. dotenv의 최상위에서 실행된다.

```
npm i --save @nestjs/config
```

- ConfigModule 모듈을 app.module.ts에 추가해준다.

```
@Module import ConfigModule.forRoot({})
```

- app.module.ts에서 ConfigModule의 forRoot안에 ConfigModuleOptions를 살펴보면
  cache,
  isGlobal은 어플리케이션의 config 모듈에 어디서나 접근 가능하다. true로 설정,
  ignoreEnvFile은 서버에 deploy(배포)할 때 환경변수(.env) 파일을 사용하지 않는다.
  true로 설정,
  ignoreEnvVars,
  envFilePath는 ".env"로 읽게 설정,
  encoding,
  validationSchema는 원하는 모든 환경 변수의 유효성을 검사할 수 있다.,
  validationOptions,
  load,
  expandVariables 이러한 값들이 있다.

```
     isGlobal: true,
    envFilePath: '.env',
```

- .env.dev 개발용, .env.test 테스트용 .env.prod 프로덕션용
  환경변수 파일을 생성한다.

- package.json scripts에서 start:dev를 입력하면 production 환경으로 설정
  나중에는 test를 입력하면 test 환경으로 설정

```
npm i cross-env
```

- cross-env는 (cross platform)가상 변수를 설정할 수 있게 해준다.
  윈도우나 맥이나 리눅스나 상관없이 사용할 수 있게 해준다.

```
  "start:dev": "cross-env ENV=dev nest start --watch",
```

- npm run start:dev로 실행하면 cross-env ENV=dev nest start --watch로 출력된다.
- app.module.ts에서 envFilePath를 다음과 같이 작성해준다.

```
    envFilePath: process.env.NODE_ENV === "dev" ? ".env.dev" : ".env.test",
```

- NODE_ENV와 같이 이름은 임의로 작성해주어도 되는 것 같다.
- .env.prod은 나중에 하기 위해 삭제해준다.
- dev면 .env.dev를 사용하고 dev가 아니면 .env.test를 사용한다.
- .gitignore에 .env.dev와 .env.test를 추가해준다.

# #2.5

- app.module.ts에서 ignoreEnvFile을 다음과 같이 작성해준다.

```
  ignoreEnvFile: process.env.NODE_ENV === "prod"
```

- prod일 떄만 true, production(운영) 환경일 때는 ConfigModule이 환경변수 파일을 무시(ignoreEnvFile)하게 한다.

```
    "start": "cross-env ENV=prod nest start",
```

- prod는 Heroku deploy(배포)할 때 사용한다.
- app.module.ts에 있던 TypeOrmModule 일부를 .env.dev에 옮긴다.

```
 host: 'localhost',
      port: 5432,
      username: 'dowon',
      password: '12345',
      database: 'nuber-eats',
```

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=dowon
DB_PASSWORD=12345
DB_NAME=nuber-eats
```

- .env.dev에 변경해주었다.
- DB_PORT 등 .env.dev에서 읽어오는 변수는 string이다.
  typeORM ConfigModuleOption의 port는 number가 되어야 한다.
  그러므로 string -> number로 바꾸기 위해서는 +를 붙여준다.

- stirng

```
"12321"
```

- number (+할 때 stirng 제거)

```
+12321
```

- app.module.ts TypeOrmModule에도 다음과 같이 변경해준다.

```
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
```

```
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string')
          ^
Error: SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string
```

- 에러가 발생했다.

```
    "start": "cross-env NODE_ENV=prod nest start",
    "start:dev": "cross-env NODE_ENV=dev nest start --watch",
```

- package.json에서 ENV를 NODE_ENV로 작성해서 해결하였다.
  cross-env 7버전 이상은 ENV가 인식이 안되는 것 같다.

- ERROR [TypeOrmModule] Unable to connect to the database. Retrying ...
  콘솔에서 다음과 같은 에러를 일부러 발생시켜 봤다. .env.dev에서 DB_NAME을 nuber-eatssss 잘못 입력해주면 다음과 같이 에러가 발생한다.
- validationSchema에서 환경변수가 준비되지 않으면 앱이 실행되지 않게 해준다.
  놓치는 게 있으면 실행이 되지 않게 설정해주어야 한다.

# #2.6

- joi는 자바스크립트용 가장 강력한 스키마 설명 언어이다. 데이터 유효성 검사 툴이다.
  https://www.npmjs.com/package/joi 환경변수의 유효성을 검사한다.
  자바스크립트로 만들어져 있다. (타입스크립트 2%)

```
npm i joi
```

- app.module.ts에 joi를 import 해준다. as가 import 모두 가져오는 것 같다.

```
import * as Joi from 'joi'
```

import Joi from "joi"는 console.log(Joi)할 때 undifined가 뜬다
export 된 멤버가 아니기 때문이다.

- app.module.ts validationSchema에서
  https://joi.dev/api/?v=17.5.0와 https://docs.nestjs.com/techniques/configuration를 보면 Joi.object를 써서 각각 검사할 수 있다.

```
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod'),
```

- 환경변수도 유효성을 검사할 수 있기 때문에 보안에 좋다.

```
  validationSchema: Joi.object({
  NODE_ENV: Joi.string().valid('coke'),
```

- "NODE_ENV" must be [coke] 정상적으로 에러가 동작한다.

```
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
```

- DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME 모두 string으로 해준다
  .env.dev에서 DB_PASSWORD=12345를 지우니까 "DB_PASSWORD" is required 에러가 발생한다. 이렇게 스키마의 유효성을 검사할 수 있다.
  이렇듯 joi를 활용해 process.env 변수의 존재를 체크할 수 잇다.
