# NUBER-EATS-BACKEND

- 나에게 주는 교훈
- 다른 사람들보다 시간이 많이 걸리더라도 완벽히 스스로 알자
- 모작이 아닌 창작을 하자.

- 주의사항
- 코드를 무작정 다 따라하지 않아야 한다.
- 내가 직접 코드를 짜볼 수 있어야한다.
- 따라만해서는 절대 실력이 늘지 않고, 자신의 실력이 아니다.

- 해결방법
- 다른 하나의 nest README에서는 직접 배운 것들을 기록한다.
- 다른 하나의 nest 폴더에서는 private로 진행한다.
- 다른 하나의 nest는 직접 배운 코드를 다르게 짜본다.

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
- synchronize는 TypeORM이 데이터베이스를 연결할 때
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

- package.json에서 start:dev를 다음과 같이 작성해준다.
  npm run start:dev로 실행하면 cross-env ENV=dev nest start --watch로 출력된다.
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

- 지금까지 Type ORM을 이용한 DB 연결을 했다.

# #3.0

- https://typeorm.io/#/entities
  Entity는 데이터베이스에 저장되는 데이터의 형태를 보여주는 모델이다.
  Entity는 데이터베이스 테이블(또는 MongoDB를 사용할 때 컬렉션)에 매핑되는 클래스입니다. 새 클래스를 정의하고 다음으로 표시하여 엔터티를 만들 수 있습니다

```
@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    isActive: boolean;

}
```

- restaurants.entity.ts @ObjectType GraphQL에서 사용한 Entity와 유사하다.
  @PrimaryGeneratedColumn()은 id를 나타내고, firstName, lastName, isActive가 @Column으로 DB로 저장되어 있다.
- @ObjectType은 자동으로 스키마를 빌드하기 위해 사용되는 GraphQL 데코레이터이다.
- @Entity()는 TypeORM이 DB의 내용을 저장해주게 한다.

- TypeORM 뜻을 까먹었다. https://dkant.net/2019/06/17/typeorm/ 참고했다.
  Object Relational Mapping, 객체-관계 매핑
  객체와 테이블 시스템(RDBMSs)을 변형 및 연결해주는 작업이라 말 할 수 있다. ORM을 이용한 개발은 객체와 데이터베이스의 변형에 유연하게 대처할 수 있도록 해준다. ORM을 객체 지향 프로그래밍 관점에서 생각해보면, 관계형 데이터베이스에 제약을 최대한 받지 않으면서, 객체를 클래스로 표현하는 것과 같이 관계형 데이터베이스를 객체처럼 쉽게 표현 또는 사용하자는 것이다.
- restaurants.entity.ts에서 TypeORM에도 사용할 수 있게 @Entity 생성하고,
  GraphQL field처럼 Column을 모두 넣어준다.
- Entity데코레이터를 이용해 Column을 모두 넣어주게 되면,
  DB에 저장된 실제 데이터의 형식을 만들 수 있게 된다.
- 테이블을 확인해본 결과 TypeORM이 DB에 Entity를 넣지 않았다.
  Entity에게 말해줘야 한다. 이럴경우 옵션 2가지가 있다.
- 옵션 1 app.module.ts TypeORMModule에 entities를 넣는다. /restaurants/entities/restaurants.entity에서 온다.

```
entities: [Restaurant],
```

- Entity "Restaurant" does not have a primary column. 에러가 발생한다.

```
  @PrimaryGeneratedColumn()
  id: number;
```

- @Field에 Number 타입도 추가해준다.
- 콘솔에 SQL문이 커지는 데 그 이유는 synchronize를 true로 설정해줘서 그렇다.
  TypeORM이 Entity를 찾고 알아서 migration 마이그레이션 해준다.
  DB 구성을 자동으로 바꿔준다.
- 수동으로 설정하는 방법 synchronize를 아래와 같이 변경해준다.

```
      synchronize: process.env.NODE_ENV !== 'prod',
```

- production 상태가 아니면 synchronize가 true가 된다.
  production에는 실제 데이터를 가지고 있기 때문에 DB를 따로 migrate하고 싶을 수 있다.
- migrate는 좀 더 나은 환경으로 옮기는 과정,
  synchronize 정확한 의미를 몰라서 찾아보았다.
  https://evan-moon.github.io/2019/09/19/sync-async-blocking-non-blocking/
  현재 작업의 응답과 다음 작업의 요청의 타이밍을 맞추는 방식이다.

- 맥 postico | 윈도우 pgadmin ✅
- 스키마 -> 테이블에서 restaurant를 확인 가능하다.
  칼럼에는 id, name, isVegan, address, ownerName 등을 확인 가능하다.
- restaurants.entity.ts에 categoryname 추가해주고, pgadmin에서 ✅한다.
- 스키마를 자동으로 생성해주고 DB에도 즉시 반영해준다.
- ObjectType과 Entity를 섞는 방법을 알았다.

# #3.1

- TypeScript를 이용해 DB에 있는 restaurant에 접근하는 방법
- TypeOrmModule에서 Repository에는 2 옵션이 있다.
- 옵션 1 Active Record 옵션 2 Data Mapper가 있다.
  DB랑 상호작용할 때 쓰는 패턴이다.
- Ruby on Rails, Django는 Active Record를 사용한다.
  Ruby on Rails는 간략하게 프로그래밍 언어 Ruby로 개발되었고,
  완성도 있는 서비스를 빠르게 개발할 수 있다. Django는 파이썬
  https://edu.goorm.io/learn/lecture/16335/%ED%95%9C-%EB%88%88%EC%97%90-%EC%9D%BD%EB%8A%94-%EB%A3%A8%EB%B9%84-%EC%98%A8-%EB%A0%88%EC%9D%BC%EC%A6%88/lesson/806287/ruby-on-rails%EB%9E%80
- NestJS는 Data Mapper를 이용한다.
- https://typeorm.io/#/active-record-data-mapper
- Active Record 패턴은 모델 내에서 데이터베이스에 액세스하는 접근 방식
  소규모 앱에 단순하게 사용할 수 있도록 도와준다.
- Data Mapper는 모델 대신 리포지토리 내의 데이터베이스에 액세스하는 접근 방식
  유지관리를 도와주고 대규모 앱에 적합하다.
- TypeOrm에서 Active Record 패턴으로 사용하고 싶다면
  restaurants.entity.ts @Entity를 BaseEntity로 extends 해줘야 한다.

- 액티브 레코드 패턴

```
@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    isActive: boolean;

}
```

- 엔터티로 작업하는 방법

```
// example how to save AR entity
const user = new User();
user.firstName = "Timber";
user.lastName = "Saw";
user.isActive = true;
await user.save();

// example how to remove AR entity
await user.remove();

// example how to load AR entities
const users = await User.find({ skip: 2, take: 5 });
const newUsers = await User.find({ isActive: true });
const timber = await User.findOne({ firstName: "Timber", lastName: "Saw" });
```

- 내가 사용하고 싶은대로 만들기

```
const timber = await User.findByName("Timber", "Saw");
```

- 데이터 매퍼 패턴

```
@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    isActive: boolean;

}
```

- 엔터티로 작업하는 방법

```
const userRepository = connection.getRepository(User);

// example how to save DM entity
const user = new User();
user.firstName = "Timber";
user.lastName = "Saw";
user.isActive = true;
await userRepository.save(user);

// example how to remove DM entity
await userRepository.remove(user);

// example how to load DM entities
const users = await userRepository.find({ skip: 2, take: 5 });
const newUsers = await userRepository.find({ isActive: true });
const timber = await userRepository.findOne({ firstName: "Timber", lastName: "Saw" });
```

- 내가 사용하고 싶은대로 만들기

```
const userRepository = connection.getCustomRepository(UserRepository);
const timber = await userRepository.findByName("Timber", "Saw");
```

- data Mapper 패턴에는 User.find(), new 같은 것을 사용하지 않는다
  Entity와 실제로 상호작용하는 Repository를 사용한다.
  User Entity에 접근하기 위해 getRepository(User)를 사용한다.
  User.save() -> userRepository.save()를 한다.
  User.find() -> userRepository.find()를 한다.
- NestJs Data Mapper 사용 이유는 NestJS + TypeOrm 개발 환경에서
  실제로 구현하는 서비스, 테스팅, 유닛테스팅 등
  어디서든지 접근 가능한 Repository를 사용하는 모듈을 사용할 수 있기 때문이다.
- NestJs는 자동으로 Repository를 사용할 수 있도록 class에 알아서 준비해준다.

# #3.2

- restaurants.module.ts은 providers를 이미 가지고 있다.
  export도 있고, app.module.ts에는 import도 있다.
  repository를 import 해볼 것이다.
  restaurants.module.ts은 restaurant Repository가 필요하다.

```
  imports: [TypeOrmModule.forFeature([Restaurant])],
```

- restaurants.module.ts TypeOrmModule.forFeature([])을 넣는다.
  괄호 안에 entity의 class가 여러개이면 여러개를 넣는다.
  Restaurant는 entity이다.
- DB를 접근할 수 있는 service를 만든다.
- restaurants 폴더 안에 restaurants.service.ts 파일을 생성한다.

```
@Injectable()
export class RestaurantService {}
```

- restaurants.service.ts를 RestaurantService에 inject 하려면 restaurants.resolver.ts RestaurantReslover에서 constructor를 작성한다.

```
  constructor(private readonly restaurantService: RestaurantService) {}
```

- Error: Nest can't resolve dependencies of the RestaurantReslover (?). Please make sure that the argument RestaurantService at index [0] is available in the RestaurantsModule context.

- 에러의 의미는 Nest가 RestaurantReslover에서 RestaurantService를 resolve(귀결))하지 못했다는 뜻이다.
- https://okky.kr/article/384413 자바스크립트 패턴과 테스트라는 책에서
  resolve를 귀결이라고 번역 했다고 하는데, 귀결이란 논의나 행동 등이 어떤 결론이나 결과에 이르게 된다는 뜻이다.
- restaurants.module.ts에서 providers에 RestaurantService를 추가 해주었다.

```
  providers: [RestaurantReslover, RestaurantService],

```

```
  @Args('veganOnly') veganOnly: boolean
```

- restaurants.resolver.ts RestaurantReslover에서
  모든 restaurant들을 가져오는 부분인 restaurants() 괄호 안에 부분을 삭제하였다.

- RestaurantService에서 service를 하나 return 한다.
  restaurants.service.ts RestaurantService에서 getAll()을 작성해서
  모든 restaurant들을 가져온다.

- PART 1 restaurants.module.ts에서 TypeOrmModule을 이용해
  Restaurant repository를 imports한다.
- PART 2 restaurants.service.ts RestaurantService를 만들고,
  restaurants.module.ts RestaurantService에서
  repository를 사용하기 위해 service를 restaurants.resolver.ts RestaurantReslover에 (constrctor ~) import한다.
- PART 3 restaurants.resolver.ts RestaurantReslover는 restaurants():
  Restaurant[] {} 괄호 안에 this.restaurantService.getAll()을 return한다
- PART 4 (980줄까지 한 다음) restaurants.service.ts에서 getAll() {} 괄호 안에
  this.restaurants.find()를 return 한다.

```
  this.restaurantService.getAll()
```

- 'void' 형식은 'Restaurant[]' 형식에 할당할 수 없습니다라고 에러가 발생한다.
- Promise<>를 안 작성해줘도 에러가 발생한다.

```
getAll(): Promise<Restaurant[]>
```

- restaurants.service.ts RestaurantService에서 다음과 같이 추가해준다.

```
  restaurants(): Promise<Restaurant[]>
```

- 그리고 repository를 inject 해야 하기 때문에 restaurants.service.ts에 constructor()을 추가해준다.
  restaurants.module.ts imports도 inject하기 위해 작성하였다.

```
 constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
  ) {}
```

- Restaurant entity의 InjectRepository를 하고 있고,
  이름은 restaurants, class는 Restaurant entity를 가진 Repository이다.
  restaurants.service.ts getAll(): Promise<Restaurant[]> {}
  괄호 안에 아래와 같이 작성한다.

```
return this.restaurants.
```

- Repository에 접근해 모든 것을 할 수 있다. find를 넣어주었다.
- repository를 inject하고 나면 restaurants.module.ts에서 모든게 동작한다.
- restaurants.resolver.ts에도 Promise를 작성해준다.
  ```
  restaurants(): Promise<Restaurant[]> {}
  ```
- http://localhost:3000/graphql에서 스키마를 확인해보면
  최신으로 업데이트 된 것을 확인할 수 있다.

```
{
  restaurants{
    id
  }
}
```

```
{
  "data": {
    "restaurants": []
  }
}
```

- 빈 배열을 가지고 있지만, DB에 접근하는 게 성공했다.query: SELECT "Restaurant"."id" AS "Restaurant_id", "Restaurant"."name" AS "Restaurant_name", "Restaurant"."isVegan" AS "Restaurant_isVegan", "Restaurant"."address" AS "Restaurant_address", "Restaurant"."ownerName" AS "Restaurant_ownerName", "Restaurant"."categoryname" AS "Restaurant_categoryname" FROM "restaurant" "Restaurant"

# #3.3

- 정리
- app.module.ts TypeOrmModule에 Restaurant라는 배열의 entitis를 가지고 있다.
  이것은 Restaurant이 DB가 된다. logging은 DB의 모든 로그를 확인하는데,
  production 환경이 아니면 logging이 되지 않게 한다.

```
      logging:  process.env.NODE_ENV !== 'prod',
```

- restaurants.module.ts에서 한 것은 Restaurant를
  forFeature을 사용해 import 했다. feature은 Restaurant entity이다.
- forFeature은 TypeOrmModule이 특정 feature을 import 할 수 있게 해준다.
- https://docs.nestjs.kr/techniques/database를 참고하면 forFeature() 메소드를 사용하여 현재 범위에 등록된 저장소를 정의합니다.
- restaurants.module.ts RestaurantService는 class에 inject할 수 있게 providers에 추가되어야 한다. 이걸해주면 서비스에 접근할 수 있다.
- 그리고 유저가 restaurants.resolver.ts RestaurantReslover로 가면 this.service.getAll()을 return 한다.
- restaurants.service.ts로 가면 getAll function이 this.restaurants.find()를
  return하는 것을 볼 수 있다. restaurants는 Restaurant entity의 repository이다.
  https://typeorm.io/#/active-record-data-mapper
  Data Mapper pattern에서 1번을 2번처럼 사용할 수 있다.

```
1. const userRepository = connection.getRepository(User);
```

```
2. @InjectRepository(Restaurant)
```

- 1번에서 볼 수 있는 Repository가 2번에서 Repository를 inject하면 작동된다.
  좋은 decorator(@)가 있기 때문에 nestJS typeOrm을 사용한다.
  restaurants.service.ts InjectRepository()안에 entity의 이름(Restaurant)을 넣어 호출한다. restaurants.entity.ts @Entity()여야한다.
  private readonly로 만들고, 이름은 restaurants,
  타입은 Restaurant Repository로 만든다.
- this.restaurants. 뒤에 find, save, marge 등 모두 사용할 수 있다.
  이렇게 하면 DB의 모든 것을 사용할 수 있게 된다.
  이런식으로 TypeORM(Entity)을 graphql의 @objectType 옆에 쓰면 DB 모델 생성하고, 자동으로 graphQL에 스키마를 작성할 수 있게 해준다.
  restaurants.resolver.ts에서
  restaurants()과 같이 graphql query에도 사용할 수 있다.
  restaurants.resolver.ts restaurantService에 연결되고
  @InjectRepository(Restaurant)와 같이 DB에 접근한다.

- bugod님이 잘 정리 한 내용

- 전체 흐름: AppModule - TypeOrmModule - RestaurantsModule - RestaurantResolver - RestaurantService

1. TypeOrmModule에 DB로 전송할 entity들 설정

2. RestaurantsModule
   : TypeOrmModule의 Restaurant 엔티티를 다른 곳에서 Inject할 수 있도록 import하기.
   : providers에 RestaurantService 주입 => RestaurantResolver에서 사용 가능.

3. RestaurantService
   : @InjectReposity(entity): 전달받은 entity를 기반으로 Repository 생성.
   : Repository의 메서드들로 DB에 접근하는 방식 지정.

4. RestaurantResolver
   : GraphQL Query/Mutation으로 DB에 접근하는 RestaurantService의 메서드들 활용.

# #3.4

- Restaurant 생성하는 게 목적이다. restaurants.service.ts getAll()을 보면
  (method)를 만들어야 한다. (method)는 class안에 있는 function이다.

```
class Person {
  //Person 유형에만 작동하는 메소드입니다.
  func personGreeting() {
    greet(yourName: "Santosh", category: .Person)
    }
}
```

- method는 Person을 예로 들어보면 class 안에 있는 Persion이 method이다.
- restaurants.service.ts에서 createRestaurant() 를 만든다.
  restaurants.resolver.ts에서 createRestaurant()를 호출하면
  restaurants.service.ts에서 createRestaurantDto를 메소드의 형태로 받는다.

  ```
    createRestaurant(createRestaurantDto: createRestaurantDto) {}
  ```

- TypeOrm 문서를 보면 create와 save 2가지 있다. 이 두 가지의 차이점을 알아본다.
- 새로운 Photo를 생성하는 예시 (목적 = DB에 Photo 저장)

```
createConnection(/*...*/).then(connection => {

    let photo = new Photo();
    photo.name = "Me and Bears";
    photo.description = "I am near polar bears";
    photo.filename = "photo-with-bears.jpg";
    photo.views = 1;
    photo.isPublished = true;

    return connection.manager
            .save(photo)
            .then(photo => {
                console.log("Photo has been saved. Photo id is", photo.id);
            });

}).catch(error => console.log(error));
```

- 1가지 방법은 new photo()를 사용하는 것이다.
  이것은 js, ts 측면에서 class 생성밖에 안된다. DB를 건들지 않는다.
  그저 생성하는 것이다.

```
(ex)
let photo = new Photo();
    photo.name = "Me and Bears";
```

```
const newRestaurant = new Restaurant();
  newRestaurant.name = createRestaurantDto.name;
```

- restaurants.service.ts createRestaurant {} 괄호 안에 newRestaurant을 넣는다.
- 매번 위의 코드와 같은 방식이면 힘들기 때문에 this.restaurants.create()를 만든다.
  ()을 보면 이것은 새로운 인스턴스를 생성한다.
  ()안에 이미 만든 createRestaurantDto를 넣어준다.

  ```
    const newRestaurant = this.restaurants.create(createRestaurantDto);
  ```

  아래의 코드를 새로 만들지 않아도 된다. 이것이 dto와 ts의 장점이다.
  object, class, arguments를 모두 믿을만하기 때문이다.

```
  {
      name: createRestaurantDto.name,
    }
```

- newRestaurant의 Restaurant은 js에만 존재하고 DB에는 실제 저장되어 있지 않다.
  DB에 저장하고 싶으면 save 메소드를 사용해야 한다.

```
(ex)
return connection.manager.save(photo)
```

```
return this.restaurants.save(newRestaurant)
```

- ()안에 entity를 newRestaurant으로 설정한다.
  create는 Restaurant, save는 Promise를 리턴한다.
  Promise<Restaurant>을 해준다.

- Restaurant가 잘 생성되면 true와 false로 결과를 리턴한다.
  restaurants.resolver.ts에서 createRestaurant async로 바꾸고
  return true를 try catch문으로 사용한다.
  async문을 작성할 때는 Promise와 value를 사용해야 한다.
- http://localhost:3000/graphql에서 실행해본다.

  ```
  mutation {
  createRestaurant(name: "kim good", isVegan: false, address: "1212", ownerName: "minsu")
  }
  ```

- error: error: "categoryname" 칼럼(해당 릴레이션 "restaurant")의 null 값이 not null 제약조건을 위반했습니다.
- restaurants.entity.ts를 보면 categoryname이 string이기 때문에 null이면 안 되는데,
  Restaurant를 생성할 때 categoryname을 전달해주지 않았고, 아무도 알려주지 않았다.
  entity에는 넣었는데 createRestaurantDto에는 넣지 않아서 에러가 발생했다.

```
{
  "data": {
    "createRestaurant": false
  }
}
```

- await을 빠트려서 true로 나왔다. 이제 정상적으로 false가 나온다.

# #3.5

- create-resturant.dto.ts에 categoryName을 추가하지 않았다. dto에 업데이트를 하지 않았다.
  entity를 수정하고 나서 복붙으로 해결 가능하다.
  매번을 복붙하면 비효율적이다. 코드로 접근을 한다.
- ObjectType, Field 데코레이터(@)로 graphql 타입을 만들고 있다.
- Entity, Column 데코레이터(@)로 DB 테이블도 만들고 있다.
- 모든게 통합되기 때문에 graphql, Entity 수정할 필요가 없다. 하지만 문제는 dto가 Entity와 통합 생성되지 않는다.
- Mapped types를 사용해서 Restaurant entity 파일 하나로 DB테이블. graphql 타입, dto 3가지 모두 생성하는 것으로 고쳐본다.
- Mapped types는 base type을 바탕으로 다른 버전들을 만들 수 있게 해준다.
- https://docs.nestjs.com/graphql/mapped-types#mapped-types
  Partial, Pick, Omit, Intersection 등이 있다.
- PartialType은 base type, base class를 가져다가

```
class CreateUserInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  firstName: string;
}
```

- export하고, 이 모든 field가 required가 아닌 class로 만들어준다.

```
@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {}
```

- PickType은 input type에서 몇 가지 property를 선택해 새로운 class를 만들어준다.

```
@InputType()
class CreateUserInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  firstName: string;
}
```

- email처럼 특정 property를 선택 (pick) 한다.

```
@InputType()
export class UpdateEmailInput extends PickType(CreateUserInput, ['email'] as const) {}
```

- property 뜻을 몰라서 찾아보았다. https://m.blog.naver.com/magnking/220966405605 MDN에선 property는 해당 object의 특징입니다. property는 보통 데이터 구조와 연관된 속성을 나타냅니다. property에는 2가지 종류가 있습니다. 인스턴스 프로퍼티(Instance property)들은 특정 object 인스턴스의 특정한 데이터를 가지고 있습니다. 정적 프로퍼티(Static Property)들은 모든 object 인스턴스들에게 공유 된 데이터를 가지고 있습니다.
  MS에선 프로퍼티를 object를 위해서 데이터를 저장한다는 뜻으로 사용하고 있다.

- OmitType은 base class에서 class를 만드는데 몇몇 field를 제외하고 만든다.

```
class CreateUserInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  firstName: string;
}
```

- CreateUserInput은 email, password, firstName를 가지지만, email을 제외(omit)한다.

```
@InputType()
export class UpdateUserInput extends OmitType(CreateUserInput, ['email'] as const) {}
```

- IntersectionType은 두 개의 input을 합쳐주는 역할을 한다.

```
@InputType()
class CreateUserInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class AdditionalUserInfo {
  @Field()
  firstName: string;

  @Field()
  lastName: string;
}
```

- CreateUserInput + AdditionalUserInfo

```
@InputType()
export class UpdateUserInput extends IntersectionType(CreateUserInput, AdditionalUserInfo) {}
```

- Partial, Pick, Omit, Intersection 4가지가 조금 어려워서 찾아보았다. https://kyounghwan01.github.io/blog/TS/fundamentals/utility-types/#partial
- Partial 파셜 타입은 특정 타입의 부분 집합을 만족하는 타입을 정의할 수 있습니다.
- Pick 픽 타입은 특정 타입에서 몇 개의 속성을 선택하여 타입을 정의합니다.
- Omit 특정 속성만 제거한 타입을 정의합니다.
  pick의 반대

- UpdateUserInput, IntersectionType 등은 모두 InputType을 만들어낸다.
- restaurants.resolver.ts에 @Args() 안에 'input'을 집어 넣는다. argument를 input으로 바꾼다.
- create-resturant.dto.ts에도 ArgsType을 @InputType()으로 고친다.
- http://localhost:3000/graphql DOCS를 확인하면 arguments에 input: createRestaurantDto!이 되어있는 것을 확인할 수 있다.
- create-resturant.dto.ts에 있는 모든 것을 지우고
  id를 제외한 모든 것을 받게 OmitType으로 설정한다. restaurant를 생성할 때 id를 전달할 필요가 없기 때문이다.

```
@InputType()
export class createRestaurantDto extends OmitType(Restaurant, ['id']) {}
```

- GraphQLError [Object]: Input Object type createRestaurantDto must define one or more fields.

- 모든 base class들이 UpdateUserInput,CreateUserInput 등 InputType이다
  하지만 Restaurant는 child class인 @InputType이 아니라 restaurants.entity.ts를 보면 parent class인 @ObjectType()이다.
  그래서 create-resturant.dto.ts에서 Type을 바꿔줘야 한다.
- 또 하나의 방법은 restaurants.entity.ts에서 @InputType을 추가해주는 것이다.
- Error: Schema must contain uniquely named types but contains multiple types named "Restaurant".
- 같은 데코레이터를 두 번 사용했기 때문에 좋지 않다.
  이럴경우 isAbstract를 사용해줘야 한다. InputType이 스키마에 포함되지 않기를 원한다는 뜻이다. 어디서 복사해서 사용한다는 뜻이다. 직접 사용하는 게 아니라 어떤 것으로 확장시키는 것이다.

```
@InputType({isAbstract: true})

```

# #3.6

```
mutation {
  createRestaurant(input:{
    name: "c",
    isVegan: true,
    address: "lalala",
  })
}
```

- "Field \"createRestaurantDto.ownerName\" of required type \"String!\" was not provided.",에러가 발생했다.
- @IsString()을 추가해보았지만 해결되지 않았다.

```
mutation {
  createRestaurant(input:{
    name: "c",
    isVegan: true,
    address: "lalala",
    ownerName: "kim",
    categoryname: "la"
  })
}
```

```
{
  "errors": [
    {
      "message": "Bad Request Exception",
      "extensions": {
        "code": "BAD_USER_INPUT",
        "response": {
          "statusCode": 400,
          "message": [
            "name must be longer than or equal to 5 characters"
          ],
          "error": "Bad Request"
        }
      }
    }
  ],
  "data": null
}
```

- 다 입력해야 오류가 발생하지 않는다. 왜 그럴까?
- https://stackoverflow.com/questions/56858461/cant-solve-playground-error-variable-input-of-required-type-memberinput?rq=1 콤마 문제인 줄 알았는데, 아닌 것 같다.
- 내 생각엔 ownersName,categoryname 이 두 가지를 지우지 않아서 발생한 오류라고 생각한다. 강의에는 지우지 않았지만, 소스코드에는 지워져 있다.

  ```
  @Field((type) => String)
  @Column()
  @IsString()
  ownersName: string;

  @Field((type) => String)
  @Column()
  @IsString()
  categoryname: string;
  ```

- 다시 에러 메세지로 돌아가서 name이 5글자보다 크거나 같아야 한다고 나온다는 말은 dto가 class validator에 의해서 validate(검증) 되고 있다는 뜻이다. 그리고 이 모든 것이 entity파일에 들어가 있다.

```
mutation {
  createRestaurant(input: {
    name: "real time",
    isVegan: true,
    address: "lalala"
  })
}
```

```
{
  "data": {
    "createRestaurant": true
  }
}
```

- true로 출력된다. pgAdmin4 쿼리도구를 이용해서 검색해보았다. SELECT _ FROM name_of_table 인데
  사용하고 있는 테이블은 restaurant 이니까 SELECT _ FROM restaurant으로 입력해서 실행하면 이름과 주소 등을 확인해볼 수 있다.
- postico보다는 직관적이지 않아서 직접 입력해줘야 한다. 맥북프로 사고 싶다..
- isVegan을 매번 true로 보내고 있는데, default 값을 이용해서 false면 false지만 아무것도 안 보내면 default를 true로 한다. dto validate(검증) 먼저 한다. @isOptional을 추가해준다. @isOptional는 값이 누락되었는지 확인하고, 없다면 모든 validator을 무시한다.

```
FieldOptions
 name?: string;
    description?: string;
    deprecationReason?: string;
    complexity?: Complexity;
    middleware?: FieldMiddleware[];
```

- FieldOptions은 다음과 같고, graphql 스키마 기본값 true로 해준다.
- localhost:3000/graphql을 보면 isVegan: Boolean = true로 나와있는 것을 확인할 수 있다. isVegan이 required가 아니게 되었다. 그래서 지우고 테스트 할 수 있다.

```
mutation {
  createRestaurant(input: {
    name: "without vegan",
    address: "lalala"
  })
}
```

```
{
  "data": {
    "createRestaurant": true
  }
}
```

- pgAdmin에도 추가된 것을 볼 수 있다.

```
mutation {
  createRestaurant(input: {
    name: "without vegan",
    isVegan: "fdsfsfsff",
    address: "lalala"
  })
}
```

```
 "Boolean cannot represent a non boolean value: \"fdsfsfsff\"",
```

- validation 테스트도 해보면 정상적으로 된다.
  graphql, database, validation 3번씩 테스트 것에 익숙해져야 한다.
  ```
  { defaultValue: true }
  ```
- defaultValue는 isVegan: Boolean = true로 나와있는 것처럼 isVegan을 정의해주지 않는 이상 isVegan이 true라고 나온다.
- restaurants.resolver.ts에서 console.log(createRestaurantDto)를 해준다.

```
[Object: null prototype] {
  name: 'korea',
  isVegan: true,
  address: 'lalala'
}
```

- isVegan true를 보낸적이 없지만 defaultValue 덕분에 dto에 추가되어 있다.

```
mutation {
  createRestaurant(input: {
    name: "assda",
    address: "lasdadlala"
  })
}
```

```
[Object: null prototype] { name: 'assda', address: 'lasdadlala' }
```

- nullable은 dto 내용이 아예 없다.
  콘솔에도 아무것도 안 나온다.

  ```
  { nullable: true, defaultValue: 'dsfsfs' }
  ```

  ```
  GraphQLError [Object]: Boolean cannot represent a non boolean value: "dsfsfs"
  ```

- boolean이기 때문에 string 타입은 사용할 수 없다. nullable은 true나 false인 boolean만 가능하지만,

- defaultValue는 아무거나 될 수 있다. defaultValue true나 false인 이유는 필드의 타입이 true(Boolean)이기 때문이다.

```
@Field((type) => String, { defaultValue: "그래"})
  @Column()
  @IsString()
  address: string;
```

- 이렇게 하면 dto에 필드 내용을 추가할 수 있다. address: String = "그래"와 같이 나온다.
