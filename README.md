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

- 느낀점
- 실력이 늘기 위해서는 관련 문서를 많이 읽고 적용 해봐야겠다.

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

- @Args('name') name: string 이런식으로 많은 resolver를 작성해줘야 해서 번거로운 방법이었고, InputType은 graphql에서 name: "" 같은 object를 많이 전달해줘야 해서 번거로운 방법이었기 때문에 ArgsType으로 변경해주면 이러한 수고로움을 겪지 않아도 된다.
- class CreateRestaurantDto에 모든 것을 관리할 수 있는
  ArgsType이 제일 좋은 방법인 것 같다.
- 그리고 이 방식을 사용하면 class의 유효성검사도 할 수 있다.

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
  이렇듯 joi를 활용해 process.env 변수의 존재를 체크할 수 있다.

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

- true로 출력된다. pgAdmin4 쿼리도구를 이용해서 검색해보았다.

```
SELECT * FROM name_of_table
```

- 인데 사용하고 있는 테이블은 restaurant 이니까 SELECT \* FROM restaurant으로 입력해서 실행하면 이름과 주소 등을 확인해볼 수 있다.

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
- restaurants.resolver.ts에서

```
console.log(createRestaurantDto)
```

를 해준다.

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

# #3.7

- restaurants.resolver.ts에서 restauant를 update하는 mutation을 만든다.

```
 @Mutation((returns) => Boolean)
  async updateRestaurant() {}
```

- dtos 폴더에서 update-restaurant.dto.ts 파일을 생성하고, create-resturant.dto.ts를 보면 Restaurant에서 id를 제외한 OmitType으로 되어 있다. 이것을 update-restaurant에도 비슷하게 한다. PartialType을 사용한다. PartialType은 type의 선택적인 property이다라는 설명이 좀 어려워서 파셜 타입은 특정 타입의 부분 집합을 만족하는 타입이라고 하는 이 표현이 이해하기 좋은 것 같다.

- update-restaurant.dto.ts에서 create-resturant.dto.ts를 PartialType으로 import 시켜준다.

```
@InputType()
export class updateRestaurantDto extends PartialType(CreateRestaurantDto) {}
```

- resolver, mutation에 어떤 restaurant를 수정 할 것인지 알려주기 위해 id를 보내야 한다.
- restaurants.resolver.ts에서 updateRestaurant안에 id에 해당하는 argument를 쓰고, number라고 알려준다.

```
    @Args('id') id: number,
    @Args('data') data: updateRestaurantDto,
```

- restaurant를 update하려면

```
mutation {
  updateRestaurant(data: {name: "real time"}, id:1)
}
```

- "message": "Cannot return null for non-nullable field Mutation.updateRestaurant." 리턴(return)을 하지 않아서 에러가 발생했다.

```
  async updateRestaurant(
    @Args('id') id: number,
    @Args('data') data: updateRestaurantDto,
  ) {
    return true;
  }
```

- 많은 Argument를 주는 것보다 class로 dto 하나만 만드는 것을 선호한다.

```
{
  "data": {
    "updateRestaurant": true
  }
}
```

- 그렇기 때문에 id와 UpdateRestaurantDto를 합친다.
- Restaurant이 아닌 CreateRestaurantDto를 PartialType으로 하는 이유는 updateRestaurantDto에 id가 꼭 필요하기 때문이다.
- Restaurant을 PartialType으로 만들면 id도 옵션사항이 되기 때문에 CreateRestaurantDto를 PartialType으로 한다.

- update-restaurant.dto.ts에서 ArgsType을 만들었기 때문에

```
  async updateRestaurant(@Args() updateRestaurantDto: updateRestaurantDto) {
```

- restaurants.resolver.ts에서 다음과 같이 변경해준다.
  이렇게 하면 updateRestaurantDto에 InputType이 필요 없게 되고 ArgsType만 있으면 되게 된다.
- InputType은 data Field에 있고, data Field는 updateRestaurantDto 안에 있다. 이게 ArgsType이 된다.
- InputType을 사용한다면 argument에 이름이 있어야 한다.

```
@Args("input") // argument name
```

= @Argstype을 사용한다면 argument에 이름이 없어야 한다.

```
@Args("") // argument name empty
```

- @InputType()으로 고쳐준다.
  localhost:3000/graphql에서 다음과 같이 확인한다.

```
 updateRestaurant(...): Boolean!
 input: updateRestaurantDto!
type updateRestaurantDto {
 id: Float!
 data: updateRestaurantInputType!
```

# #3.8

- updateRestaurantDto를 사용한다.
- service에 resolver를 연결시킨다.
- restaurants.service.ts에서 updateRestaurant fuction을 만들어준다. updateRestaurantDto를 가진다.

```
  updateRestaurant(updateRestaurantDto: UpdateRestaurantDto);

```

- update-restaurant.dto.ts와 restaurants.resolver.ts에서 updateRestaurantDto를 UpdateRestaurantDto로 대문자로 변경해주었다.

- UpdateRestaurantInputType의 export를 제거한다. 꺼내서 사용하지 않으니까 제거해준 것 같다.

- restaurants.service.ts updateRestaurant()안에 restaurant repository에서 update method를 사용한다.

```
 this.restaurants.update()
```

- update(criteria: string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<Restaurant>, partialEntity: QueryDeepPartialEntity<...>
- 기준(criteria)이나 특징 같이 update하고 싶은 data, entity의 필드를 보내야 한다. 기준(criteria)은 id를 넣는다.

```
  updateRestaurant({ id, data }: UpdateRestaurantDto) {
    this.restaurants.update(id, {...data});
  }
```

- updateRestaurantDto를 지우고 { id }를 넣어주고,
  update() 괄호안에 UpdateRestaurantDto.id 대신 id만 넣어준다. update 하고자하는 object인 data를 받아온다.
  {...data}는 삼항연산자로 data의 content(내용)을 가져온다.
- update()는 Promise를 반환(return)한다. 왜냐하면
  데이터베이스에 해당 entity가 있는지 확인하지 않고 update query를 실행한다.

```
  updateRestaurant({ id, data }: UpdateRestaurantDto) {
    this.restaurants.update({name: "lalala"}, {...data});
  }
```

- name이 "lalala"라는 사람을 data로 restaurants에서 update 할 수도 있다.
- update method는 restaurants가 db에 있는지 없는 지 신경 쓰지 않는다. query를 update할 때 사용한다. restaurant이 존재하는 지 확인하지 않는다.

```
  this.restaurants.update(id, {...data})
```

- 더 빠르게 동작하니까 존재하지 않는 id를 넣어도 에러가 나오지 않는다.
- SQL로 된 query가 id 20000인 restaurant로 update한다.
- restaurants.service.ts에서 restaurant를 update한다.
- restaurants.resolver.ts에서 아래 코드와 같이 고친다.

```
Promise<boolean> {
    try {
      await this.restaurantService.updateRestaurant(updateRestaurantDto);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
```

- localhost:3000/graphql에서 restaurant를 update한다.

```
mutation {
	updateRestaurant(input: {
    id:5,
    data:{name: "Updated!!",
    isVegan: false}
  })
}
```

- mutation {
  updateRestaurant(input: {
  id:5,
  data:{name: "Updated!!",
  isVegan: false}
  })
  }

- pgAdmin에서 확인해본 결과
  Updated!!, false, 그래 등 모두 업데이트 되었다.

```
{
  "data": {
    "updateRestaurant": true
  }
}
```

- 잘못된 id를 입력해도 위와 같이 true로 나온다.

# #4.0

- User Entity(id, createdAt, updatedAt, email, password, role(client | owner | delivery)
- User CRUD( Create Account, Log In, See Profile, Edit Profile, Verify Email)
- 배우는 것들 :
- User Model은 너무 많이 가지고 있어 module 중 가장 느리다.
- relationship, columns 이용해서 모델을 만든다.
- account를 만든다는 것은 password hash, 검증 하는 방법을 배운다.
- Log In, account는 인증(authentication), 권한부여(authorization) 방법을 배운다.
- guards, middlewares, metadata와 같은 것을 배운다.
- 우리만의 decorators를 만든다.
- 충분하지 않으면 테스팅한다. 하지만 아직 GraphQL resolver를 테스트 하는 방법을 모른다. unit, end-to-end testing도 아직 모른다.
- User 다음 restaurant, order, payment를 진행할 예정이다.

# #4.1

- nest g mo users (vscode 터미널)
- users 모듈을 만든다. App module을 바꿔야 한다.
- app.module.ts에서 RestaurantsModule과 entities의 [Restaurant] 엔티티 위치를 변경하기 위해 [] 안에 있는 Restaurant을 지워준다.

- users 폴더에 entities 폴더와 users.entity.ts파일을 생성해준다.
- users.entity.ts에는 User class와 @Entity를 만들어준다.

```
@Entity()
export class User {}

```

- entity의 계획
- (id, createdAt, updatedAt)은 entity 어디에나 있을 필드(field)이다.
- user, resturant, order, payment entity들이 ID를 가질 것이다.
- 모든 entity들은 (ID, createdAt, updatedAt)을 가진다. 반복하지 않기 위해서 나중에 다룬다.
- (email, password, role)을 먼저 다룬다. 이것은 모두 string 타입(type)이다.

- 룰(role)은 entity가 관계(relationship)에서 수행하는 기능을 role이라고 한다. https://ganghee-lee.tistory.com/20 참고함.

. 3개의 룰(role)을 가진다.

- 무엇으로 등록하건 원하는 것을 볼 수 있다.
- 1. 사용자(user), 손님이다. client는 레스토랑 리스트를 볼 수 있다.
- 2. 레스토랑을 등록하고 싶으면 owner로 등록할 수 있다. owner은 대시보드를 볼 수 있다.
- 3. 배달원으로 등록할 수도 있다. delivery(배달원)은 현재 갈 수 있는 모든 주문의 실시간 상황을 볼 수 있다.

```
type UserRole = 'client' | 'owner' | 'delivery';

@Entity()
export class User {
  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: UserRole;
}
```

- Column과 email과 password를 추가해주고,
  role을 추가해주고 role에는 UserRole type에는 client, owner, delivery 3가지 타입을 작성해준다.

- id, createdAt, updatedAt를 하기 위해서 common이란 module을 생성한다. common에는 기본적으로 app에서 공유하는 모든 것이 commonModule에 적용된다.
- nest g mo common (vscode 터미널)
- common 폴더에 entities 폴더와 core.entity.ts 파일을 만들어준다.

```
export class CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
```

- core.entity.ts CoreEntity class를 만들어주고 PrimaryGeneratedColumn 데코레이터를 넣어주고 id type을 입력해준다.
- @PrimaryGeneratedColumn은 특정 클래스 속성을 테이블 열로 표시하는 데 사용된다.
- @Column()의 옵션인 primary를 대체할 수 있다. Primary Key를 만드는 역할을 한다.
- 자동생성되는 ID값을 표현하는 방식을 아래와 같이 2가지 옵션을 사용할 수 있도록 도와준다.
- increment: AUTO_INCREMENT를 사용해서 1씩 증가하는 ID를 부여하는 기본 옵션이다.
- uuid: 유니크한 uuid를 사용할 수 있다.
- https://yangeok.github.io/orm/2020/12/14/typeorm-decorators.html 나중에 시간되면 더 읽어봐야겠다. 잘 작성되어 있다.

```
export class User extends CoreEntity {
}
```

- CoreEntity를 확장(extends)해서 import 해준다.
- 만드는 모든 entity는 CoreEntity에서 확장(extends)된다.

```
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
```

- 위의 코드는 core.entity.ts CoreEntity 아랫줄에 추가해준다.
- CreateDateColumn은 해당 열이 추가된 시각을 자동으로 기록합니다. 옵션을 적지 않을시 datetime 타입으로 기록됩니다.
- UpdateDateColumn 해당 열이 수정된 시각을 자동으로 기록합니다. 옵션을 적지 않을시 datetime 타입으로 기록됩니다.
- https://yangeok.github.io/orm/2020/12/14/typeorm-decorators.html 참고함

```
      entities: [User],
```

- app.module.ts에서 entities에서 User을 추가해준다.
- pgAdmin4에서 확인해보면 id, createdAt
  updatedAt, email, password, role을 가지고 있는 것을 확인할 수 있다.
- GraphQLError [Object]: Query root type must be provided. (console 에러) (원인 resolver 작업을 아직 하지 않음)
- 이제 CRUD{Create(생성), Read(읽기), Update(갱신), Delete(삭제)}를 가지고 시작할 수 있다.

# #4.2

- resolver를 만들어본다.
- users폴더 안에 users.resolver.ts와 users.service.ts 파일을 만든다.
- service는 repository를 필요로 한다.
- users.module에서 특정 feature을 import 할 수 있게 해주는 forFeature을 사용해 User를 랩핑(wrapping)해준다.

```
  imports: [TypeOrmModule.forFeature([User])],
```

- imports와 providers 차이는 다음과 같다.
- imports : 해당 모듈에서 필요한 export된 provider 리스트를 의미한다.
- providers : Nest injector(의존성을 주입하는 Nest 내부 모듈)에 의해 인스턴스화 되는 provider를 의미한다. 해당 모듈을 통해 공유되는 비즈니스 로직이라고 생각하면 좋다.
- https://www.wisewiredbooks.com/nestjs/overview/05-modules.html
  (imports, providers 검색)
- 인스턴스화 : 클래스로부터 객체를 만드는 과정
- https://hungryboy.tistory.com/18 (인스턴스화 검색)
- users.service.ts에 아래와 같이 constructor을 만들어준다.

```
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}
}
```

- @InjectRepository는 클래스를 공급자로 표시하는 데코레이터입니다. Nest의 내장 DI(Dependency Injection) 시스템을 사용하여 생성자 매개변수 주입을 통해 공급자를 다른 클래스에 주입할 수 있습니다.

공급자를 주입할 때 표시되어야 합니다.

- InjectRepository 데코레이터를 통해 User Entity 를 users를 UserService에 주입하여 사용하는 모습이다.
- https://medium.com/crocusenergy/nestjs-typeorm-%EA%B8%B0%EB%B3%B8-crud-%EC%9E%91%EC%84%B1%ED%95%98%EA%B8%B0-69b9640dc826 (InjectRepository 검색)

```
@Resolver((of) => User) // of가 function 이거나 없어도 된다.
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}
}
```

- Resolver 데코레이터를 통해 usersService를 UsersResolver에 주입하여 사용하는 모습이다.

```
  providers: [UsersResolver, UsersService],
```

- users.module.ts에서는 providers를 restaurants.module.ts에서 한 것과 같이 UsersResolver, UsersService를 넣어준다.

- GraphQLError [Object]: Query root type must be provided.(console 에러) (원인 query를 resolver에 만들어주지 않았다.)

- users.resolver.ts에서 UsersResolver안에 Query를 입력해준다.

```
  @Query((returns) => Boolean)
  hi() {
    return true;
  }
```

http://localhost:3000/graphql DOCS에서 hi: Boolean!이 나타나는 것을 확인할 수 있다.

# #4.3

- User graphQL object를 만들고 나서 Create Account Mutation을 위한 DTO를 만든다.
- users.entity.ts에서 @ObjectType, @InputType와 isAbstract: true를 추가해준다.

```
@InputType({ isAbstract: true })
@ObjectType()
```

- users.entity @Field 타입을 ;없이 String, core.entity의 @Field 타입을 ;없이 (id) => Number, (createdAt, updatedAt) => Date으로 입력해준다.

```
  @Field((type) => String)
  @Field((type) => Number)
  @Field((type) => Date)
```

- 이제 DTO를 만든다 users.resolver.ts에서 첫번 째 Mutation을 임시로 만든다.

```
  @Mutation((returns) => Boolean)
  createAccount(@Args('input') createAccountInput:);
```

- InputType을 createAccountInput으로 만든다.
- users폴더에 dtos폴더를 생성한다.
- DTO가 뭔지 까먹었다. 여기에 계층간 데이터 교환을 위한 객체라고 자세하고 친절하게 나와있다. 그외에도 DAO, Entity class 등 나와 있다. 최고인 듯 https://gmlwjd9405.github.io/2018/12/25/difference-dao-dto-entity.html (dto 검색)
- create-account.dto.ts에서 입력, 출력 2개의 DTO를 만든다.

```
export class createAccountInput extends PickType(User, [
  'email',
  'password',
  'role',
]) {}
```

- Mapped types인 PickType을 사용한다.
- createAccountInput을 User와 email, password, role을 선택(Pick)타입으로 만들었다. create Account DTO라고 불러도 된다.

```
@ObjectType()
export class createAccountOutput {
  @Field((type) => String, { nullable: true })
  error?: string;
  @Field((type) => Boolean)
  ok: boolean;
}
```

- createAccountOutput 만들고, ok, error 등 @Field 타입과 메소드에서 null값을 허용할 경우 보여주는 표시인 nullable로 입력해준다.
- https://hashcode.co.kr/questions/974/nullable-%EC%96%B4%EB%85%B8%ED%85%8C%EC%9D%B4%EC%85%98%EC%9D%98-%EC%93%B0%EC%9E%84 (nullable 검색)

```
@Mutation((returns) => createAccountOutput)
  createAccount(@Args('input') createAccountInput: createAccountInput) {}
```

- Unexpected empty method 'createAccount'.eslint@typescript-eslint/no-empty-function 하는 도중에 에러가 발생했다.
- .eslintrc.js에서 아래 코드를 추가해줬다.

```
    '@typescript-eslint/no-empty-function': 'off',
```

- https://dev-yakuza.posstree.com/ko/react-native/eslint-prettier-husky-lint-staged/ (no-empty-function 검색)

- users.resolver.ts에서 임시로 적은 Boolean 대신 createAccountOutput, createAccountInput을 넣어준다.
- Error: Cannot determine a GraphQL input type ("createAccountInput") for the "input". Make sure your
  class is decorated with an appropriate decorator.
  GrapQL input type을 정할 수 없습니다. class는 적절한 데코레이터로 꾸며줘야 합니다.
- create-account.dto.ts에서 @InputType @ObjectType을 넣어준다.
- http://localhost:3000/graphql DOCS TYPE DETAILS에서 role: String!을 3가지 옵션만 가능한 것으로 바꿔줄 수 있다.
- 나중에는 CreateAccountOutput을 commonModule에 넣을 수도 있다.

# #4.4

- userRole을 enum이라는 type으로 변경한다.

- enum은 열거하다(나란히 늘어놓다)(enumerable)이다.
- enum으로 불리는 object 같은 것이다.
- 아래 코드처럼 Direction을 열거할 수 있다.

```
enum Direction {
  Up,
  Down,
  Left,
  Right,
}
```

- 위 코드에서 Up이 1 로 초기화된 숫자 열거형을 선언했다. 그 지점부터 뒤따르는 멤버들은 자동으로 증가된 값을 갖는다. 즉 Direction.Up 은 1, Down 은 2, Left 는 3, Right 은 4 을 값으로 가진다.
- https://www.typescriptlang.org/ko/docs/handbook/enums.html (enum typescript 검색)

- users.entity.ts에서 type UserRole을 지운다.

```
type UserRole = 'client' | 'owner' | 'delivery';
```

- enum UserRole로 바꿔주고, { Client, Owner, Delivery }를 넣어준다.

```
enum UsersRole {
  Client,
  Owner,
Delivery
}
```

```
  (enum member) UserRole.Client = 0
  (enum member) UserRole.Owner = 1
  (enum member) UserRole.Delivery = 2
```

- DB안에 UserRole로 0,1,2 와 같이 나란히 나열된다.
- 코드로 UserRole.Client, Owner, Delivery 등을 쓸 수 있다는 것을 의미한다.

```
  @Column({
    type: 'enum',
    enum: UserRole,
  })
```

- users.entity.ts Column() 안에 type을 'enum'으로 전달해주고 enum: UserRole이 된다.

```
  @Field((type) => UserRole)
registerEnumType(UserRole, { name: 'UserRole' });
```

- GraphQL에도 enum을 users.entity.ts에 registerEnumType()으로 enumRef는 UserRole, 이름은 UserRole로 만들어준다.
- @Field도 UserRole로 만들어준다.

```
  @Field((type) => UserRole)
```

- type UserRole이 graphQL을 가지고 있다.

```
  @Column({
    type: 'enum',
    enum: UserRole,
  })
```

- DB에는 type이 enum인 UserRole이 있다.

```
enum UserRole {
Client
Owner
Delivery
}
```

- http://localhost:3000/graphql DOCS에서 role: UserRole! ENUM DETAILS에서 enum 3가지 옵션만 가진 것을 확인할 수 있다.
- users.service.ts에서 service에서 createAccount()는 createAccountInput을 받게되고, type은 createAccountInput이 된다.

```
  createAccount(createAccountInput: createAccountInput) {
  }
```

- 새로운 user인지 확인한다.
- 새로운 user을 만들어주고, 비밀번호를 hash 해준다.
- 모든 것이 true이면, ok return해주고, false이면 error return해준다.

```
  async createAccount({email, password, role}: createAccountInput) {
    try {
      const exists = await this.users.findOne({ email });
      // user exist check
    if(exists) {
      // make error
      return;
    }
    await this.users.save(this.users.create({ email, password, role }));
    return true;
    } catch(e) {
      return;
    }
  }
```

- ES6 기능을 활용해 위 코드처럼 변경한다.
- async/await과 try~catch를 사용한다.
- findOne()은 주어진 환경(condition)과 일치하는 첫 번째 entity를 찾는다.
- findOne()은 사용자를 찾기 위해 많은 옵션 개체를 사용하는데 email, id, username 등을 사용하여 검색할 수 있다.
- if(exists)로 에러를 만들고 return 해준다.
- this.users.create()와 save()는 다르다.
- create()는 객체를 만들기만 하고 DB에 직접적으로 저장하지 않는다.
- https://popawaw.tistory.com/173 (this.users.save create 검색)
- save()는 DB에 직접 저장한다.
- this.users.save()안에 create()를 만들어준다.
- create({})안에는 email, password, role를 넣어준다.

```
 Promise<Entity | undefined>
```

- findOne()은 Promise Entity 또는 undefined로 return한다.
- tryCatch.ts 만든 다음 데코레이터 만들고 사용하는 방법을 모르겠다.

```
  @Query(() => LoginOutput)
  @TryCatch('유효하지 않은 접근입니다.')
  async login(@Args('token') token: string) {
return await this.userService.login(token);
  }
}
```

- 위 코드의 방식은 사용 방법을 아직 잘 모르겠다 방법을 찾아 고민해봐야겠다.

# #4.5

- Go는 error를 return하지만, TS는 throw error 해야 한다.
- 만약에 에러를 throw, raise 같이 error을 강제로 일으키지 않는다면, resolver에서 어떤일을 해야 할까?
- users.resolver.ts createAccount안에 try/catch문을 작성한다.

```
try {
      const error = await this.usersService.createAccount(createAccountInput);
      if (error) {
        return {
          ok: false,
          error,
        };
      }
    } catch (e) {}
```

- async/await을 하고, try/catch를 한다.
- error가 있으면 ok는 false, error로 반환(return)되게 error 처리를 해준다.

```
 async createAccount(
    @Args('input') createAccountInput: createAccountInput,
  ): Promise<createAccountOutput>
```

- Promise<>와 createAccountOutput을 추가해서 function을 수정한다.

```
 return {
       ok: true,
     };
  catch (error) {
  return {
    error: error,
    ok: false,
  };
```

- users.resolver.ts createAccount에서 ok true로 반환(return)되고, catch에서는 error: error, ok: false로 반환되게 error 처리를 해준다.
- users.service.ts에서 createAccount를 변경한다.

```
 async createAccount({
    email,
    password,
    role,
  }: createAccountInput): Promise<string | undefined>
```

- Promise<>와 string이나 undefined를 return 해준다.

```
   async createAccount({
    email,
    password,
    role,
  }: createAccountInput): Promise<string | undefined> {
    try {
      // email을 가지고 있는 지 확인
      const exists = await this.users.findOne({ email });
      // user가 존재한다면, string을 return한다.
      if (exists) {
        return '해당 이메일을 가진 사용자가 이미 존재합니다.';
      }
      // else면 아무것도 return 하지 않는다.
      // 인스턴스를 만들고 난 뒤 user를 동시에 저장(save)한다.
      await this.users.save(this.users.create({ email, password, role }));
    } catch (e) {
      // 에러가 있으면 string을 return한다.
      return '계정을 생성할 수 없습니다.';
    }
  }
```

- 정리하자면 users.service.ts에서는 위 코드와 같고,
  users.resolver.ts에서는 아래 코드와 같다.

```
 async createAccount(
    @Args('input') createAccountInput: createAccountInput,
  ): Promise<createAccountOutput> {
    try {
      // error function은 error에 대해 요청(asking)한다.
      // createAccount는 string이나 undefined를 return한다.
      const error = await this.usersService.createAccount(createAccountInput);
      // 에러가 있으면 ok는 false, error return한다.
      if (error) {
        return {
          ok: false,
          error,
        };
      }
      // 에러가 없으면 ok는 true를 return한다.
      return {
        ok: true,
      };
    } catch (error) {
      // 예상하지 못한 에러가 있으면 error를 return하고, ok는 false이다.
      return {
        error,
        ok: false,
      };
    }
  }
```

- password를 해싱(hashing), 암호화(encrypting)을 하지 않았지만, string을 return하는 것을 http://localhost:3000/graphql 에서 테스트 해본다.

```
mutation {
	createAccount(input:{
    email:"kim@kim12.com",
    password: "1234567",
    role: Client
  }) {
    ok
    error
  }
}
```

- 1번 할 때

```
{
  "data": {
    "createAccount": {
      "ok": true,
      "error": null
    }
  }
}
```

- 2번 할 때

```
{
  "data": {
    "createAccount": {
      "ok": false,
      "error": "해당 이메일을 가진 사용자가 이미 존재합니다."
    }
  }
}
```

- pgAdmin user에서 자료보기를 클릭하여 id, createdAt, updatedAt, email, password, role 등을 확인할 수 있다.
- role을 Client를 했기 때문에 0으로 보여지는 것을 확인할 수 있다.

# #4.6

- 아래의 코드를 개선할 수 있다.

```
  if (error) {
        return {
          ok: false,
          error,
        };
      }
      return {
        ok: true,
      };
```

- users.service.ts createAccount에서 string이나 undefined 대신 배열(array)를 return한다.

```
<string | undefined>
```

- 위 코드 대신에

```
<[boolean, string?]>
```

- string은 있을 수도 있고, 없을 수도 있다.
- string은 graphql type이다.
- https://www.apollographql.com/docs/apollo-server/schema/schema/#scalar-types

```
return [false, '해당 이메일을 가진 사용자가 이미 존재합니다.'];
return [false, '계정을 생성할 수 없습니다.'];

```

- users.service.ts에서 ok의 boolean 값으로 false, error 메세지를 return 한다.

```
return [true]
```

- 위의 코드는 배열[]을 true로 return 한다.

```
      const [ok, error] = await this.usersService.createAccount(
        createAccountInput,
      );
```

- users.resolver.ts에서도 배열[] ok,error로 할 수 있다.

```
      // 에러가 있으면 ok는 false, error return한다.
      if (error) {
        return {
          ok: false,
          error,
        };
      }

```

- 위의 코드를 지우고 아래의 코드만 사용할 수 있게 대체할 수 있다.

```
      return {
        ok,
        error
      };
```

- if/else를 안해도 되고, 코드가 줄어들어서 보기 좋은 것 같다.
- ok는 true/false되거나, error는 undefined/string 될 수 있다.
- if 생략은 배열[]을 return한다는 전제에 가능하다.

```
<{ok: boolean, error: string?}>
```

- 원하면 object를 return 할 수도 있다.

```
return {ok: false, error: '해당 이메일을 가진 사용자가 이미 존재합니다.'};
return { ok: true };
return { ok: false, error: '계정을 생성할 수 없습니다.' };
```

```
      const {ok, error} = await this.usersService.createAccount(
        createAccountInput,
      );
```

- 이러한 옵션도 있지만, 배열(array) 방식보다 객체(object) 방식으로 한다.
- 객체(object) 방식이 친절한 코딩, 협업시 일관된 에러 처리를 할 수 있다.
- users.service.ts UsersService는 ok, error만 처리할 것이다.
- users.resolver.ts createAccountInput, createAccountOutput과 같이 input, output을 보낸다.

# #4.7

- pgAdmin4에서처럼 데이터베이스(db)에 비밀번호를 입력하는 것은 나쁜 보안방법이다.
- 비밀번호를 해싱(hashing)한다.
- asdasdasd 님 정리 (hashing password)
- https://www.youtube.com/watch?v=67UwxR3ts2E (hashing password)
- hash function은 input 문자열에 대해 이상한 output 문자열을 출력하는 함수이고, 단방향성은 output을 토대로 input 역추정이 불가하다. input을 조금만 수정해도 output은 크게 달라진다. input에 대한 output은 언제나 동일하고, rainbow table에서 확인 가능하다. salt(짧은 임의의 텍스트)와 함께 hash 함수 실행 => rainbow table에서 확인 불가.)

- password를 그대로 저장하지 않고, 단방향성(one way) function인 hash를 저장한다..
- ex) 12345 -> hash function -> we
- user의 password를 모른다. 보안적 위험이 있는 DB에 저장하지 않고, hash에 저장한다.
- 단방향성 function이기 때문에 못생긴 패스워드(uglypassword)를 123 같이 만들수 없다.

```
DELETE FROM public."user"
	WHERE ID=0;
  DELETE FROM public."user"
	WHERE ID=1;
  DELETE FROM public."user"
	WHERE ID=2;
DELETE FROM public."user"
	WHERE ID=3;
```

- 테이블에 있는 내용을 모두 삭제해준다.

- listeners는 entity에 무슨일이 있을 때 실행된다.

- 모든 엔터티에는 특정 엔터티 이벤트를 수신하는 사용자 지정 논리가 있는 메서드가 있을 수 있다.
- https://github.com/typeorm/typeorm/blob/master/docs/listeners-and-subscribers.md#what-is-an-entity-listener (typeorm listener)

```
@Entity()
export class Post {

    @AfterLoad()
    updateCounters() {
        if (this.likesCount === undefined)
            this.likesCount = 0;
    }
}
```

- 엔티티에 어떤 이름으로든 메소드를 정의하고 @AfterLoad로 표시하면 TypeORM은 엔티티가 QueryBuilder 또는 repository/manager 메소드를 사용하여 Post를 로드될 때마다 이를 호출한다.
- https://github.com/typeorm/typeorm/blob/master/docs/listeners-and-subscribers.md#what-is-an-entity-listener (typeorm listener)

```
  @AfterLoad
  @BeforeInsert
  @AfterInsert
  @BeforeUpdate
  @AfterUpdate
  @BeforeRemove
  @AfterRemove
```

- 위에 데코레이터들은 특정 이벤트(event)를 기반의 function을 불러주는 decorator(@)들이다.
- Entity안에 어떤 이름이든 메소드(method)를 정의하고, 표시(mark)할 수 있는 BeforeInsert를 적용해본다.

```
@Entity()
export class Post {

    @BeforeInsert()
    updateDates() { // 원하는 것을 넣으면 된다.
        this.createdDate = new Date();
    }
}
```

- 엔티티에 어떤 이름으로든 메소드를 정의하고 @BeforeInsert로 표시할 수 있다. 그러면 Repository/manager를 사용하여 엔티티가 삽입되기 전에 TypeORM이 이를 호출한다.

```
  @BeforeInsert()
  async hashPassword(): Promise<void> {}
```

- users.entity.ts에서 @BeforeInsert를 만든다.
- hashPassword라는 원하는 이름을 넣어준다.
- async, Promise<>안에 공백으로 원하는 이름을 넣어준다.

- password를 해싱(hashing)하기 위해서는 hash를 할 수 있고(can), 확인(check)하는 데 사용하고, password를 확인(check) 할 수 있고, salt를 만들 수 있는 Bcrypt를 사용한다.
- https://www.npmjs.com/package/bcrypt (Bcrypt 검색)
- npm i bcrypt (vscode 터미널)
- https://www.npmjs.com/package/@types/bcrypt (types Bcrypt 검색)
- npm i @types/bcrypt --dev-only (vscode 터미널)

```
import * as bcrypt from 'bcrypt';
```

- users.entity.ts에서 bcrypt를 import 해준다.

```
 // 인스턴스를 만들고 난 뒤 user를 동시에 저장(save)한다.
      await this.users.save(this.users.create({ email, password, role }));
```

- users.service.ts에서 save하기 전에 create 했는데 이때 이미 password 인스턴스(instance)를 가지고 있었다.

```
  @BeforeInsert()
  async hashPassword(): Promise<void> {
    // 패스워드를 못생기게 바꾼다.
    this.password = await bcrypt.hash(this.password, 10);
  }
```

- @BeforeInsert를 DB에 저장하기 전에 인스턴스(instance)의 users.service.ts에서 create안의 password를 받아서 가진다. users.entity.ts에서는 this.password이다.
- entity만 생성하기만 하고, DB에 저장하지 않는다.
- entity를 저장하기 전에는 users.entity.ts의 bcrypt로 password를 못생기게 만든 다음에 users.service.ts에서 저장한다.

- https://gofnrk.tistory.com/112 (saltOrRounds 검색)
- saltOrRounds는 salt를 몇 번 돌리는 지의 의미이다. 보통 기본 10으로 설정한다. saltOrRounds가 높을수록 암호화가 강력해지지만 속도는 현저히 느려진다.

```
 @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
      // 패스워드를 못생기게 바꾼다.
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
```

- try/catch를 써준다.
- InternalServerErrorException을 throw하면 users.service.ts this.users.save에서 catch한다.
- 계정을 생성할 수 없습니다.를 return한다.

```
mutation {
	createAccount(input:{
    email:"kim@kim.com",
    password: "12345",
    role: Client
  }) {
    ok
    error
  }
}
```

```
{
  "data": {
    "createAccount": {
      "ok": true,
      "error": null
    }
  }
}
```

- pgAdmin4에서 $2b$10$MCE~~~blablabla 못 생겨 진 것을 확인할 수 있다.

# #4.8

- login resolver, service method를 만든다.
- users.resolver.ts에다가 mutation을 만들어준다.
- users/dtos안에 login.dto.ts파일을 생성한다.
- output부터 만드는 것을 시작한다.
- common폴더에 dtos폴더와 output.dto.ts파일을 생성한다.

```
@ObjectType()
export class createAccountOutput {
  @Field((type) => String, { nullable: true })
  error?: string;
  @Field((type) => Boolean)
  ok: boolean;
}
```

- create-account.dto.ts에서 @ObjectType() CreateAccountOutput 위의 코드를 반복하고 있다.
- 위 코드를 복사해서 output.dto.ts에 붙여넣기 한다.
- output.dto.ts의 class를 MutationOutput으로 변경한다.
- create-account.dto.ts에서 있었던 위의 코드는 삭제해버리고 아래의 코드를 작성한다.

```
export class createAccountOutput extends MutationOutput {}
```

- common/dtos output.dto.ts에서 MutationOutput을 각자 다른 이름을 붙이기 위해 extends 한다.
- users.resolver.ts에는 CreateAccoutOutput이란 이름을 쓰고 싶기 때문이다.

- GraphQLError [Object]: Type createAccountOutput must define one or more fields. 에러가 발생하기 때문에 @ObjectType()를 common/dtos output.dto.ts, user/dtos create-account.dto.ts 둘 다 추가해준다.

```
type createAccountOutput {
error: String
ok: Boolean!
}
```

- output에 String, Boolean!이 작동하는 것을 확인할 수 있다.

- login.dto.ts에도 같은 것을 만들어준다.

```
@ObjectType()
export class LoginOutput extends MutationOutput {}
```

- class를 LoginOutput으로 만들어준다.

```
  @Mutation((returns) => LoginOutput)
```

- users.resolver.ts에도 @Mutation을 LoginOutput을 리턴(returns) 한다.

```
  @Field((type) => String)
  token: string;
```

- login.dto.ts에서 ok, error과 별개로 mutation인 login이 token을 리턴(return)한다. 왜? token을? 암호화((encrypting)랑 관련 있나?

```
  async login(@Args('input') loginInput: LoginInput) {}
```

- input타입으로 해주고 users.resolver.ts에서 createAccountInput 한 거랑 같이 loginInput을 해주고, 나중에 LoginInput을 넣는다.

```
@InputType()
export class LoginInput extends PickType(User, ["email", "password"]) {}

```

- login.dto.ts에서는 loginInput class를 만들고, PickType을 사용해서 username, password만 요청한다.

```
  @IsEmail()
  @IsEnum(UserRole)
```

- users.entity.ts에서 email과 enum에 클래스 유효성검사를 해준다. enum에는 UserRole이란 entity를 넣는다.

```
login(
input: LoginInput!: LoginOutput! //MUTATION
input: LoginInput! // ARGUMENTS
// TYPE
email: String!
password: String!
```

- graphQL http://localhost:3000/graphql에서 확인할 수 있다.

```
mutation {
	login(input:{
    email:"kim@kim.com",
    password: "12345",
  }) {
    ok
    error
  }
}
```

```
      "message": "Cannot return null for non-nullable field Mutation.login.",
```

- return을 아직 해주지 않아서 나오지 않는다.

```
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {}
```

- users.resolver.ts에서 Promise<> 안에 LoginOutput를 써주었다.

# #4.9

- users.service.ts에서 login function을 만든다.

```
 async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {}
```

- LoginInput에서 email, password를 받고, promise에서 createAccountInput과 같이 ok, error를 넣어주고, 추가로 token을 return한다.

```
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
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
```

- users.service.ts async 안에 위 코드를 작성해준다.
- try/catch를 사용한다.
- 첫 번째로 email을 가진 user를 찾는다(find).
- 두 번째로 password가 맞는지 확인(check)한다.
- 세 번째로 JWT를 만들고 user에게 준다(give).

- 12345가 $2b$10$MCE~~~와 같은지 어떻게 알 수 있을까?
  user가 주려는 password를 hash해서 12345를 못생기게(ex $2b$10$MCE~~~)로 만든 다음 이 못생긴 password가 DB의 password와 맞는지 확인한다.
- 만약 같다면 user가 password를 제대로 준 것이다.
- 이 방식으로 하면 실제 password를 알지 않고도 사용자가 올바르게 입력했는지 알 수 있다.
- 유저 password 줌 => hash => DB와 비교

- https://joshua1988.github.io/web-development/javascript/javascript-asynchronous-operation/ (자바스크립트 비동기 처리와 콜백 함수)
- https://joshua1988.github.io/web-development/javascript/promise-for-beginners/
  (자바스크립트 Promise 쉽게 이해하기)
- https://joshua1988.github.io/web-development/javascript/js-async-await/
  (자바스크립트 async와 await)
- 위에 3개의 글은 재밌고, 이해 잘 되고, 잘 썼으니 까먹으면 다시 제대로 정독한다. 대충 보면 안본것만도 못하다.

```
  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      // compare 같은지 안 같은지 비교
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
```

- users.entity.ts에서 CoreEntity안에 async checkPassword라고 하고 aPassword를 받는다. Promise는 boolean으로 return한다.
- try/catch 사용한다.
- aPassword랑 this.password랑 비교한다.

```
     const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: '잘못된 비밀번호입니다.',
        };
      }
```

- users.service.ts에서 try {} 안에 작성해준다. users.entity.ts에 checkPassword 메소드를 가지고 있다. user.checkPassword에서 user은 entity의 user이다.
- (password)는 값이 string이다.
- passwordCorrect가 만약 안될 경우 잘못된 비밀번호라고 리턴해준다.

```
      const user = await this.users.findOne({ email });
```

- 두 코드(const user, user.checkPassword)의 user는 서로 다르다. 왜 다를까?... 둘 다 user:User로 되는데 둘 다 같은 것 아닐까? this.users.findOne 여기서 users랑 user.checkPassword 여기서 user랑 다른게 아닐까? 생각해본다.

```
 try {
         const { ok, error, token } = await this.usersService.login(loginInput);
      return { ok, error, token };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
```

- #4.8에서 users.resolver.ts Mutation login 방치했던 것 안에 위 코드와 같이 try/catch를 작성한다.

```
  @Field((type) => String, { nullable: true })
  token?: string;
```

- login.dto.ts에서 @objectType안에 token은 ?(optional)token?이다.
- nullable 즉 null도 가질 수 있는 타입이다. nullable true 해준다.

```
  if (!passwordCorrect) {
        return {
          ok: false,
          error: '잘못된 비밀번호입니다.',
        };
      }
      return {
        ok: true,
        token: 'lalalala',
      };
```

- 위 코드와 같이 잘못된 패스워드가 아니면 반환하게끔 확인한다.

```
  return await this.usersService.createAccount(
  return await this.usersService.login(loginInput);
```

- users.resolver.ts에서 위 코드와 같이 수정해준다.

```
      return {
        ok: true,
      };
```

- users.resolver.ts에서 return 부분은 지워준다.

```
mutation {
	login(input:{
    email:"kim@kim.com",
    password: "12345",
  }) {
    ok
    error
    token
  }
}
```

```
{
  "data": {
    "login": {
      "ok": true,
      "error": null,
      "token": "lalalala"
    }
  }
}
```

```
mutation {
	login(input:{
    email:"kim@kim.com",
    password: "dfsfsdfsff",
  }) {
    ok
    error
    token
  }
}
```

```
{
  "data": {
    "login": {
      "ok": false,
      "error": "잘못된 비밀번호입니다.",
      "token": null
    }
  }
}
```

- http://localhost:3000/graphql에서 lalalala의 토큰 테스트 결과를 확인할 수 있다.

- 다음에는 토큰 발생(generate)시키기를 테스트 해본다.

# #5.0

- token을 만드는 방법은 첫번째 방법은 수작업, 두번째 방법은 nestjs/passports를 적용시킨 후 passport-jwt, nestjs/jwt를 활용하는 방법이 있다. 스스로 하는 방식을 배우기 위해 첫번째 방법으로 token을 만든다.

- https://docs.nestjs.com/security/authentication#implementing-passport-strategies (nestjs 인증(Authentication) 검색)

```
ConfigModule.forRoot
TypeOrmModule.forRoot
GraphQLModule.forRoot
```

- app.module.ts에서 위의 모듈처럼 모듈을 만드는 것을 아직 배우지 않았다.
- jwt를 직접 만들어서 인증(authentication)을 구현한다.
- forRoot를 직접 만들면 email 보내고, email 모듈 forRoot를 만들 때 매우 유용하다.
- users.service.ts에서 token generation을 작동하게 만들어준 뒤에 모듈로 적용시켜본다.

# #5.1

- https://www.npmjs.com/package/jsonwebtoken
  (jsonwebtoken 검색)
- npm i jsonwebtoken (vscode 터미널)
- https://www.npmjs.com/package/@types/jsonwebtoken (@types/jsonwebtoken 검색)
- npm i @types/jsonwebtoken --only-dev (vscode 터미널)
- https://github.com/auth0/node-jsonwebtoken
  (github jsonwebtoken)

```
// 동기(Synchronous) Sign with RSA SHA256
// sign with RSA SHA256
var privateKey = fs.readFileSync('private.key');
var token = jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256'});
```

- https://www.hanumoka.net/2018/10/06/javascript-20181006-javascript-callback/
  (Synchronous 검색)

- jwt.sign({foo: "bar"처럼 원하는 데이터를 토큰에 넣음})
  , privateKey와 algorithm을 적어준다.
- privateKey는 app.module.ts process.env에서 가져온다.

```
var jwt = require('jsonwebtoken');
var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
```

- { algorithm: 'RS256' } 알고리즘을 안 써줘도 되는 기본(default)이다.

```
      validationSchema: Joi.object({
        SECRET_KEY: Joi.string().required(),
      )}
```

- https://huniroom.tistory.com/entry/7NestJS-Configuration-%ED%99%98%EA%B2%BD%EB%B3%80%EC%88%98-%EC%84%A4%EC%A0%95-nestjsconfig-cross-env-joi (validationSchema 검색)
- validationSchema는 package.json에서 설정한 NODE_ENV에 설정한 환경변수가 유효한지 검사한다.
- app.module.ts validationSchema 안에 token을 지정하기 위해 사용하는 privateKey인 SECRET_KEY를 넣어준다.
- privateKey로 token을 지정하는 이유는 개발자가 사용자 token을 수정했는지 확인할 수 있게 하기 위해서이다.
- 사용자도 token의 정보를 볼 수 있지만, 사용자가 정보 수정하는 경우 사용자가 수정한 정보를 개발자가 알 수 있다.
- token을 사용자(user)로 지정하면 사용자가 자신의 token 안에 무엇이 들어있는지 암호를 해독할 수 있다. 그렇기 때문에 token은 ID 정도의 정보를 사용자가 누군지 알 수 있게 보여주는 게 좋고, 개인정보를 넣으면 좋지 않다.
- https://randomkeygen.com/ 256비트 CodeIgniter 암호화 키를 복사 붙여넣기 해서 .env.dev에서 SECRET_KEY=ur~~~~~를 넣어준다.
- 사용자에게 json web token이라는 약간의 json을 주고, 개발자가 사용자에게 주는 json을 지정해야 한다. 그렇게 해야 개발자가 준(give) json인지 가짜(fake) token인지 구별할 수 있다.
- token이 작동하게(working) 만들어주고, 그 다음에 token module을 만든다.
- token안에 정보를 넣을 것인지 정하고, privateKey를 적어준다.

```
import * as jwt from 'jsonwebtoken';
      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY);
 return {
        ok: true,
        token: 'lalalala',
      };
```

- users.service.ts에서 sign(payload: string | object | Buffer, secretOrPrivateKey: jwt.Secret, options?: jwt.SignOptions) sign안에 payload에서 누구든 token을 못보게 user id만 넣어준다.
- process.env.SECRET_KEY로 해도 괜찮지만, nethjs 방식이 아니기 때문에 app.module.ts ConfigModule을 활용한다.

```
  imports: [TypeOrmModule.forFeature([User]), ConfigService],
```

- users.module.ts로 가서 imports에 ConfigService를 추가해주면, users.service에서 get을 사용하여 값을 얻을 수 있다.

```
constructor(private readonly config: ConfigService,) {
```

- users.module.ts configService가 users.service.ts constructor() 안에 private readonly config: ConfigService로 요청받는다.

```
 error TS2554: Expected 2-4 arguments, but got 1, 63 const token = jwt.sign({ id: user.id });secretOrPrivateKey: Secret,
```

- process.env.SECRET_KEY를 지워주면 에러가 발생하기 때문에 위의 코드를 아래와 같이 바꿔준다.

```
  const token = jwt.sign({ id: user.id }, this.config.get('SECRET_KEY'));
```

- users.module.ts에서 imports configService를 users.service.ts에서 활용할 수 있게 되고, config.get('SECRET_KEY')이 작동하게 된다.
- https://darrengwon.tistory.com/965 (this.config.get 검색) 다른 파일에서 환경 변수 로드하는 방식이다.

- app.module.ts install module => users.module.ts ask configService => nestjs already know => app.module.ts Configmodule give => users.module.ts configService => ask constructor(private readonly config: ConfigService)

```
constructor(private readonly config: ConfigService,) {
    console.log(this.config.get('SECRET_KEY'));
  }
```

- constructor() {} 안에 console.log를 찍으면 키 값이 나오는 것을 확인할 수 있다.

# #5.2

- 원하는 class만 적어주면 nestjs가 정보를 가져다주는 dependency injection 때문에 configService를 적용할 수 있었다.

- app.module.ts에서 configModule을 만들고, 여러 옵션을 설정해줬다. 즉 module이 정보가 있고, 어딘가 존재한다.

```
import { ConfigService } from '@nestjs/config';
```

- users.module.ts에서 ConfigService을 요청하는 것만으로 위의 코드와 같이 원하는 것을 불러올 수 있다.

- nestjs는 이전에 설정해놓은 ConfigService를 제공해주고 있었다. 그래서 class 이름만 적어줘도 Configmodule이라고 알 수 있다.

- forRoot를 구현해본다.

```
    const token = jwt.sign({ id: user.id }, this.config.get('SECRET_KEY'));
      return {
        ok: true,
        token,
      };
```

- users.service.ts에서 먼저 token을 체크한다.

```
mutation {
	login(input:{
    email:"kim@kim.com",
    password: "12345",
  }) {
    ok
    error
    token
  }
}
```

```
{
  "data": {
    "login": {
      "ok": true,
      "error": null,
      "token": "eyJhbGciOi~~~blablabla"
    }
  }
}
```

- 위와 같이 정상적으로 token이 출력되는 것을 확인할 수 있다.

```
{
  "id": 0,
  "iat": 164~~~blabla
}
```

- jsonwebtoken의 내부는 누구나 쉽게 볼 수 있고, 비밀유지가 목적이 아니다.
- https://jwt.io/에서 누구든지 token 정보를 알아낼 수 있기 때문에 중요한 정보를 넣기에는 부적절하다.

```
   const token = jwt.sign(
        { id: user.id, password: "12345" },
        this.config.get('SECRET_KEY'),
      );
```

```
{
  "id": 0,
  "password": "12345",
  "iat": 1642333847
}
```

- https://jwt.io/에서 Invalid Signature와 함께 password가 모두 보인다.
- Invalid Signature는 token을 수정했을 때 확인이 되었지만, 백엔드로 다시 token을 가져오면, token의 정보가 수정되었기 때문에 token이 유효하지 않게 된다.
- jsonwebtoken을 이용하여 개발자가 유효한 인증을 할 수 있게 해줘야 한다. token이 개발자 것인지, 아무도 수정하지 않았는지가 중요하다.
- 내부 token의 정보보다 token의 정보가 진짜인지 가짜인지의 여부가 중요하다.
- token 모듈을 만들어본다.
- nest g mo jwt (vscode 터미널)
- app.module.ts에서 module은 static module, dynamic module이 있다.
- static module은 예를 들어 UserModule인데, UserModule은 어떤 설정(config)도 되어 있지 않다.
- dynamic module은 forRoot에 마우스를 올려보면 나온다. 설정(config)이 적용되어 있다.
- jwt가 설정(config)를 받아드릴 수 있게 바꾼다.

```
      const token = this.jwt.sign()
```

- 위의 코드처럼 jwt가 ConfigService를 가지고 있는 것처럼 바꾼다.
- dynamic module(forRoot)을 만들고, 여러가지 옵션 설정(config)을 적용시켜 준 뒤, 개발자가 설정한 옵션이 존재하는 상태의 static module을 return 값으로 내보낸다. 그러면 결과적으로 dynamic module이 static module이 된다.
- static module은 설정 해줘야 해서 중간 과정이라고 표현할 수 있다.

# #5.3

- https://medium.com/@jang.wangsu/di-dependency-injection-%EC%9D%B4%EB%9E%80-1b12fdefec4f (dependency injection 검색)
- 의존성 주입(DI, dependency injection), 의존성 분리, 제어의 반전(IOC, Inversion Of Control)
- 의존성은 class간의 의존관계이다.
- 주입은 외부에서 객체를 생성해서 넣어주는 것이다.
- 의존성 + 주입은 내부에서 만든 변수를 외부에 넣어준다.
- 의존성분리는 의존 관계 역전이라고 표현할 수 있고, 구조적 설계와 비교할 때 의존의 방향이 역전된 것이다.
- 의존성 주입 => 의존성 분리 => 기존 의존관계 역전
- 의존성 주입과 의존성 역전을 함께 생각한다.
- https://medium.com/@jang.wangsu/di-inversion-of-control-container-%EB%9E%80-12ecd70ac7ea (IOC Container 검색)
- 제어의 반전(IOC Container)는 IOC를 구현하는 프레임워크가 컨테이너이다. 제어권을 컨테이너가 가져간다. 컨테이너로 객체를 관리, 생성을 책임지고, 의존성을 관리한다.
- module에다가 forRoot를 구현한 뒤 users.service.ts에서 jwtModule을 import한다.
- https://wikidocs.net/228 (static 메소드 검색)
- app.module.ts forRoot는 static 메소드고 Dynamic Module을 return한다.
- jwtModule을 static 함수(function)으로 만든다.

```

@Module({})
export class JwtModule {
  static forRoot(): DynamicModule {
    return {
              module: JwtModule
    };
  }
}
```

- static 함수와 forRoot라고 이름 짓고, forRoot함수는 DynamicModule을 return 한다.
- DynamicModule은 또 다른 module을 return해주는 module이다.
- return {} 안을 보면 'module' 속성이 '{}' 형식에 없지만 'DynamicModule' 형식에서 필수라고 뜬다. 안에 module: JwtModule을 입력해준다.

- users.module.ts에는 ConfigService가 있는데, users.service.ts에서 사용한다. 이것과 같이 JwtService도 만들어준다. module service export 해준다.
- nest g s jwt (vscode 터미널)

```
@Module({
  providers: [JwtService] // delete
})
export class JwtModule {
  static forRoot(): DynamicModule {
    return {
      module: JwtModule,
      exports: [JwtService],
      providers: [JwtService]
    };
  }
}
```

- jwt.module.ts에서 providers: [JwtService], jwt.service.spec.ts 파일을 삭제해준다.
  return {} 안에 exports: [JwtService], providers: [JwtService] 추가해준다.
- forRoot()는 DynamicModule을 반환(return)한다.
- JwtService를 exports해서 users.module.ts에서도 사용할 수 있게 되었다.
- jwt.service.ts를 수정한다.

```
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtService {}

```

- ConfigService랑 같은 형식이 되고, import 해서 jwt.service.ts에서 사용한다.

```
    JwtModule.forRoot(),
```

- app.module.ts에서 JwtModule에 forRoot()를 추가해준다.

```
  imports: [TypeOrmModule.forFeature([User]), ConfigService, JwtService]
```

- users.module.ts에 JwtService를 추가해준다.

```
    private readonly jwtService: JwtService,
```

- users.service.ts에서는 jwt 말고 jwtService로 지은 이유는 jwt form jsonwebtoken으로 이미 import되어 있기 때문이다. jwtService는 class type이다.

- Error: Nest can't resolve dependencies of the UsersService (UserRepository, ConfigService, ?). Please make sure that the argument JwtService at index [2] is available in the UsersModule context.
- import 하지 않았기 때문에 JwtService를 찾을 수 없다는 에러이다.
- module을 많이 사용할 것 같기 때문에 global module로 설정한다.

```
   ConfigModule.forRoot({
      isGlobal: true,
   )}
```

- app.module.ts ConfigModule이 isGlobal로 설정되어 있다면 imports에 적지 않아도 된다.

```
@Module({})
@Global()
export class JwtModule {
  static forRoot(): DynamicModule {
    return {
      module: JwtModule,
      exports: [JwtService],
      providers: [JwtService],
    };
  }
}

```

- 그러므로 jwt.module.ts JwtModule에도 같이 @Global을 적용한다. 그러면 수동으로 매번 가져오지 않아도 된다.
- @Global - 모듈을 전역 범위로 만드는 데코레이터입니다. 모듈로 가져오면 전역 범위 모듈이 모든 모듈에서 표시됩니다. 이후 글로벌 모듈에서 내보낸 서비스를 주입하려는 모듈은 공급자 모듈을 가져올 필요가 없습니다.

```
@Injectable()
export class JwtService {
  hello() {
    console.log('hello');
  }
}
```

- jwt.service.ts에서 hello()과 hello 속성 값을 console.log로 입력해준다.

```
 constructor(
  ) {
    this.jwtService.hello();
  }
```

- users.service.ts에서 constructor() 안에 console.log를 찍어보면 정상적으로 hello가 출력되는 것을 확인할 수 있다.
- JwtModule.forRoot()에다가 ConfigModule과 같은 형태 JwtModule을 만들어주었다.

# #5.4

```
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // delete
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service'; // delete
import { User } from './entities/users.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigService, JwtService],
  //  ConfigService, JwtService delete
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
```

- service나 module을 import 해주는 작업이 매우 불필요한 과정이였지만, Global Module을 사용하면 import 할 필요가 없어지기 때문에 users.module.ts에서 ConfigService, JwtService를 지워준다.
- 예를 들어 만약 email module이 있으면, email module을 이메일을 어디든지 보낼 수 있도록 global module로 만들 수 있다.
- jwt.module.ts에서 module에 config 옵션을 추가하는 것을 진행해본다.
- jwt폴더에 interfaces 폴더를 추가하고, interfaces 폴더 안에 jwt-module-options.interface.ts파일을 추가한다.

```
export interface JwtModuleOptions {
  privateKey: string;
}
```

- jwt-module-options.interface.ts에서 간단한 interface를 만든다.

```
@Module({})
@Global()
export class JwtModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      exports: [JwtService],
      providers: [JwtService],
    };
  }
}

```

- jwt.module.ts에서 JwtModule forRoot() 안에 options: JwtModuleOptions를 넘겨준다.

```
 JwtModule.forRoot()
```

- app.module.ts에서 JwtModule.forRoot()에서 forRoot()에서 1개의 인수가 필요한데 0개를 가져왔습니다라는 에러가 발생한다.

```
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),

```

- forRoot()에 options를 넘겨줘야 한다. options안에 privateKey를 넣어준다.

```

      const token = jwt.sign({ id: user.id }, this.config.get('PRIVATE_KEY'));

```

```

        PRIVATE_KEY: Joi.string().required(),
        privateKey: process.env.PRIVATE_KEY,

```

- SECRET_KEY를 users.service.ts, .env.dev, app.module.ts 모두 PRIVATE_KEY로 바꿔준다.
- jwt.module.ts에서 options를 providers object를 사용하면 JwtService로 내보낼 수 있다.
- provider => Provider[] => ClassProvider => provide, useClass, scope

```
      providers: [JwtService],
      exports: [JwtService],
```

- jwt.module.ts에서 위의 코드에서 [JwtService]는 [{provide: JwtService, useClass: JwtService}], JwtService가 [JwtService]로 함축된 표현이다.

```
      providers: [
      {
        provide: "BANANA",
        useValue: options,
      },
      JwtService
    ],
    exports: [JwtService],
```

- jwt.module.ts에서 provide는 "BANANA"라는 값(value) 형식을 가졌고, useValue는 options라는 값(value)를 가진다. JwtService라는 service도 넣어준다.

```
@Injectable()
export class JwtService {
  constructor(@Inject('BANANA') private readonly options: JwtModuleOptions) {
    console.log(options)
  }
  hello() {
    console.log('hello');
  }
}
```

- jwt.service.ts에서 constructor()을 작성하고, BANANA를 @Inject 해주고, users.service.ts에서 private readonly 사용한 것과 같이 작성한다.
- jwt.service.ts에서 입력한 것과 같이 module에서 {provide: JwtService, useClass: JwtService}를 service로 inject 할 수 있다.
- console.log(options)로 vs 터미널을 위로 좀 올려서 확인해보면 { privateKey: 'urmi~~blabla' }로 출력되는 것을 확인할 수 있다.
- put providers => ask "BANANA" or "anything"(name is same) nestjs => nestjs handle injection

```
export interface JwtModuleOptions {
privateKey: string;
}
```

- jwt폴더 안에 jwt.interfaces.ts 파일을 만든 다음 jwt-module-options.interface.ts에서 사용했던 형식대로 넣는다.

```
export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';
```

- jwt폴더 안에 jwt.constants.ts 파일을 만든 다음 CONFIG_OPTIONS는 "CONFIG_OPTIONS"으로 넣는다.

```
import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptions } from './interfaces/jwt-module-options.interface'; // delete
import { CONFIG_OPTIONS } from './jwt.constants';
import { JwtModuleOptions } from './jwt.interfaces';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {
    console.log(options);
  }
  hello() {
    console.log('hello');
  }
}

```

- jwt.service.ts에 있던 "BANANA"를 CONFIG_OPTIONS로 넣어주고, JwtModuleOptions를 './jwt.interfaces'에서 import 하게 변경해준다.

- https://velog.io/@moongq/Dependency-Injection (DI 검색)
- https://darrengwon.tistory.com/1363 (typescript di 활용 검색)
- 의존성 주입에 대한 지식이 좀 더 필요한 것 같아서 찾아보았다. 의존성 주입은 의존하고 있는 코드를 클래스(class)에서 생성자(constructor)로 받아오는 것이다.
- https://angular.kr/guide/dependency-injection-in-action (TypeScript useValue, useClass, useExisting 의존성 주입 검색)
- useValue - useValue 키를 사용하면 고정된 값을 의존성 토큰에 연결할 수 있습니다. 이 방식은 웹사이트의 기본 주소나 플래그 값 등 실행시점에 결정되는 상수를 의존성으로 주입할 때 사용합니다. 그리고 이 방식은 데이터 서비스에 유닛 테스트를 적용할 때 데이터를 주입하는 용도로도 사용할 수 있습니다.
- useClass - useClass 프로바이더 키를 사용하면 이 키에 연결된 클래스 인스턴스가 대신 주입됩니다. 이 방식은 어떤 클래스를 다른 구현체로 대체할 때도 사용할 수 있습니다. 이 때 다른 구현체라는 것은 다른 정책일 수도 있고, 기본 클래스를 상속받은 클래스일 수도 있으며, 테스트 환경에서 실제 클래스를 대체하기 위한 객체일 수도 있습니다.
- useExisting - useExisting 프로바이더 키는 어떤 토큰을 다른 토큰과 연결할 때 사용합니다. 그래서 provide에 사용된 토큰은 useExisting에 사용된 토큰의 별칭(alias) 역할을 하기 때문에, 결국 같은 서비스 객체를 또 다른 이름으로 참조할 수 있습니다.
- useFactory - useFactory 프로바이더 키를 사용하면 팩토리 함수가 실행되면서 반환한 객체를 의존성으로 등록할 수 있습니다. 이 방식은 의존성으로 주입되는 서비스를 로컬 상태에 맞게 재구성해야 할 때 사용합니다.

```
import { JwtModuleOptions } from './interfaces/jwt-module-options.interface'; // delete
import { JwtModuleOptions } from './jwt.interfaces';

@Module({})
@Global()
export class JwtModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      providers: [{ provide: CONFIG_OPTIONS, useValue: options }, JwtService],
      exports: [JwtService],
    };
  }
}
```

- jwt.module.ts에서 provide는 "BANANA"라는 값(value) 대신 CONFIG_OPTIONS로 바꿔준다.
- interfaces폴더와 interfaces폴더안의 jwt-module-options.interface.ts를 지워주고, jwt.module.ts안의 JwtModuleOptions을 import한 것도 지워준다. './jwt.interfaces'로 다시 import해준다.

```
  GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
```

- global 모듈을 만들어봤고, app.module에서 설정해줄 수 있다. 두 모듈이 비슷한 것을 확인할 수 있다.

# #5.5

```
      const token = jwt.sign({ id: user.id }, this.config.get('PRIVATE_KEY'));
```

- users.service.ts에서 jwt.sign을 sign할 때 jwt.service.ts에서 JwtService를 사용하게 변경한다.
- this.jwtService.hello()를 지워준다.

```
@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {}
  sign(payload: object) {
    console.log('hello');
  }
}
```

- jwt.service.ts에서 hello()를 sign(payload: object)로 변경하고, console.log('hello')를 삭제해준다.

```
      const token = this.jwtService.sign({id: user.id});
```

- sign()을 비슷한 방식으로 만들어주기 위해서 users.service.ts에서 payload가 object 형식이기 때문에 {} 안에 id: user.id로 작성한다.

```
  sign(payload: object): string
```

- sign() string을 반환(return) 값으로 가진다.

```
      return {
        ok: true,
        token,
      };
```

- users.service.ts 위의 코드의 token이 string이기 때문에 에러가 사라진다.

```
import * as jwt from 'jsonwebtoken';
 sign(payload: object): string {
    return jwt.sign(payload, this.options.privateKey);
  }
```

- jwt.service.ts에서 sign()을 만든다.
- function sign(payload: string | object | Buffer, secretOrPrivateKey: jwt.Secret, options?: jwt.SignOptions)에서 payload 그대로 적어주고, secretOrPrivateKey는 jwt.module.ts에 (options: JwtModuleOptions)이고, jwt.interfaces.ts에 JwtModuleOptions는 privateKey가 있으니까, this.options.privateKey를 입력한다.

```
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
```

- app.module.ts에서 privateKey로 가져올 필요가 없었다.

```
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
    private readonly configService: ConfigService,
  ) {}
  sign(payload: object): string {
    return jwt.sign(payload, this.configService.get('PRIVATE_KEY'));
  }
}
```

- privateKey로 가져오지 않고, jwt.service.ts에서 ConfigService가 Global 값이기 때문에 users.service.ts처럼 사용할 있다.
- ConfigService에 ('PRIVATE_KEY')를 get() 편하게 하는 방식도 있다.
- Global module을 사용하면 이렇듯 다른 module에서 불러올 수 있다.

```
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
```

- users.service.ts에서 private readonly configService: ConfigService를 삭제한다.

```
@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {}
  sign(payload: object): string {
    return jwt.sign(payload, this.options.privateKey);
  }
}
```

- users.service.ts에서 this.configService.get('PRIVATE_KEY')를 기존의 this.options.privateKey로 변경한다.

```
mutation {
	login(input:{
    email:"kim@kim.com",
    password: "12345",
  }) {
    ok
    error
    token
  }
}
```

- localhost:3000/graphql에서 테스트 하면 token이 생성된 것을 확인할 수 있다.
- 생성된 token을 https://jwt.io/에 확인해본다.
- users.service.ts에서 token에 너무 많은 정보(개인정보 등)를 넣어주면 (유출될 우려가 있다) 안되기 때문에 JwtService는 user.id를 제외하고는 아무것도 지정해주지 않는다.

- Jwt Module을 만들 때 jwt.service.ts에서 payload가 어떤 object도 될 수 있기 때문에 다른 프로젝트에서 불러와서 사용할 수 있다.

```
  sign(userId: number): string {
    return jwt.sign({ id: userId }, this.options.privateKey);
  }
}
```

- jwt.service.ts는 다른 프로젝트에서 사용하게 만들수도 있고, 이 프로젝트에만 사용할 수 있게 만들 수도 있다. 하지만 이 프로젝트에만 사용하기 때문에 userId만 암호화해주기 위해서 object type 안에 id: userId를 넣어주고, userId: number로 넘겨준다.

```
      const token = this.jwtService.sign(user.id);
```

- users.service.ts에서도 모듈이 백엔드만 특정되게 하기 위해서 user.id만 보내준다.
- 모듈 부분은 끝났고, forRoot()를 만들고 사용할 수 있게 되었고, forRoot() 이름은 아무거나 가능하지만, register()가 약속(covention) 되어 있기 때문에 그대로 사용하는 것이 좋다.

- 글로벌(global) 모듈은 모두가 사용하기 때문에 토큰을 넘겨줄 때에는 private한 지역(regional) 모듈이 나은 것 같다.

# #5.6

- users.resolver.ts에서 query를 만들어준다.
- 토큰(token)의 정보를 어떻게 받고, 사용자가 누구인지 알 수 있다.

```
 @Query((returns) => User)
  me() {}
```

- Query 이름(name)은 me로 해주고, User를 반환(return)한다. HTTP headers를 활용하여 로그인 되어있는 User가 누구인지 반환(return)해준다.

```
mutation {
	login(input:{
    email:"kim@kim.com",
    password: "12345",
  }) {
    ok
    error
    token
  }
}
```

- localhost:3000/graphql에서 token 값을 받는다.

```
{
  "X-JWT": "eyJh~blablabla"
}
```

- HTTP headers에서 "X-JWT": "TOKEN VALUE" 을 입력해준다.

```
{
  me {
    email
  }
}
```

- "message": "Cannot return null for non-nullable field Query.me." users.resolver.ts에서 me()가 반환(return) 하지 않아서 에러가 발생한다.

```
 @Query((returns) => User)
  me() {}
```

- middleware를 구현해준다.
- nestjs와 middleware는 요청을 받고, 요청 처리 후 nest()를 호출하기 때문에 둘 다 같다.
- middleware에서 token을 가져간 후, token을 가진 사용자를 찾는다.
- https://docs.nestjs.kr/middleware를 보면 Nest 미들웨어는 기본적으로 express 미들웨어와 동일하고, 요청(request) 및 응답(response) 객체가 있고, next()을 사용한다. 그림을 보면 고객(client)이 요청(req)를 보내면 middleware가 HTTP Request로 처리하고, Route Handler로 보낸다.
- jwt 폴더에 jwt.middleware.ts 파일을 만들어준다.

```
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(req.headers);
    next();
  }
}
```

- jwt.middleware.ts에서 상속(implements)은 extends와 NestMiddleware안에 interface가 있기 때문에 다르다
- JwtMiddleware라는 class가 interface처럼 작동해야 한다.
- JwtMiddleware를 보면 'use' 속성이 'JwtMiddleware' 형식에 없지만 'NestMiddleware<any, any>' 형식에서 필수라고 한다.
- use()에 req, res, next는 각각 Request, Response, NextFunction를 express에서 가져온다.
- Request, Response를 받아서 처리를 해준 다음 next()를 호출한다.
- express에서 구현하는 것과 차이가 없다.
- console.log(req.headers)을 해주고, express처럼 next()를 호출한다.

- middleware를 한 가지 앱(app)에만 설치(install) 할 수도 있고, AppModule에 설치하여 여러 곳에 사용할 수 있다.
- UsersModule에만 설치할 수도 있지만, 모든 앱(app), 모듈(module)에서 middleware를 사용하기 때문에 app.module.ts AppModule에서 설정해준다.

```
export class AppModule implements NestModule {}

```

- app.module.ts class AppModule에서 'AppModule' 클래스가 'NestModule' 인터페이스를 잘못 구현합니다. 'configure' 속성이 'AppModule' 형식에 없지만 'NestModule' 형식에서 필수라고 에러가 발생한다.

```
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
```

- configure를 작성해주면 에러가 해결된다.
- MiddlewareConsumer는 middleware를 routes에 적용하는 방법을 정의해주는 interface이다.
- MiddlewareConsumer에서 apply(...middleware: (Type<any> | Function)[]): MiddlewareConfigProxy를 보면 apply()을 가지고 있다.

```
    consumer.apply(JwtMiddleware).forRoutes({
      path: '/graphql',
      method: RequestMethod.POST,
```

- app.module.ts에서 apply()에 Middleware는 JwtMiddleware를 넘겨주고, 미들웨어 연결해주는
  .forRoutes를 해준다.
- forRoutes는 전달된 경로 또는 컨트롤러를 현재 구성된 미들웨어에 연결합니다. 클래스를 전달하면 Nest는 이 컨트롤러 내에 정의된 모든 경로에 미들웨어를 연결합니다.

- localhost:3000 실행해보면 에러가 있지만, jwt.middleware.ts JwtMiddleware에서 console.log(req.headers)을 해주었기 때문에 accept에서 'x-jwt': 'eyJh~~~blabla' 찍혀 나오는 것을 확인할 수 있다.

```
      path: '/graphql',
      method: RequestMethod.All,
```

- app.module.ts에서 path: '/\*'를 해주고, method: RequestMethod.All을 해주면 모든 routes에 적용해볼 수 있다.

```
    consumer.apply(JwtMiddleware).exclude({
      path: '/api',
      method: RequestMethod.ALL,
```

- app.module.ts에서 path: '/api'만 제외해 주고, method: RequestMethod.All을 해주면 모든 routes에 적용해볼 수 있다.
- 경로가 많을 때 'api', "admin", "graphql" 등을 제외 시켜줄 수도 있다.

```
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(req.headers);
    next();
  }
}
```

- jwt.middleware.ts에서 injection이나 다른 기능을 사용하지 않기 때문에 class로 만들지 않고, function으로도 만들 수 있다.

```
export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(req.headers);
  next();
}
```

- jwt.middleware.ts에서 class로 만들지 않고, function으로 바꾸어 주었다.

```
    consumer.apply(jwtMiddleware).forRoutes({
      path: '/graphql',
      method: RequestMethod.ALL,
    });
```

- app.module.ts에서 JwtMiddleware는 jwtMiddleware로, forRoutes()와 path는 /"graphql"로 바꿔준다.

```
implements NestModule {
configure(consumer: MiddlewareConsumer) {
consumer.apply(jwtMiddleware).forRoutes({
path: '/graphql',
method: RequestMethod.ALL,
    });
  }
}
```

- app.module.ts에서 Appmodule에서 위의 코드를 다 지워버리고, main.ts에서 app.use(jwtMiddleware)로도 만들 수 있다. 위의 긴 코드가 한줄로 축약되기 때문에 이게 제일 편한 것 같다.
- main.ts booststrap()에서 사용하는 방법은 어플리케이션 전체만 사용가능하다.
- app.module에서 configure consumer를 사용해서 middleware를 전체나 특정 경로에 제외, 적용 시켜줄지 정하는 방식이 있다.
- 언제 제외하고, 적용시켜야 할 지 아직 감이 잘 안오지만, 미들웨어에서 제외하거나 특정 경로만 적용시켜줄 때에는 app.module.ts에서 위 코드를 사용하면 될 것 같다.

# #5.7

- JWT Middleware를 만든다.
- users repository를 사용할 예정이기 때문에 token을 가진 user를 찾아야 한다.

```
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(req.headers);
    next();
  }
}
```

- jwt.middleware.ts에서 users repository를 가져올 것이기 때문에 function => class로 다시 변경한다.

```
import { JwtMiddleware } from './jwt/jwt.middleware';
app.use(JwtMiddleware);
```

- src/app.module.ts:18:10 - error TS2724: '"./jwt/jwt.middleware"' has no exported member named 'jwtMiddleware'. Did you mean 'JwtMiddleware'? main.ts에서 에러가 발생한다.

```
import { jwtMiddleware } from './jwt/jwt.middleware';
```

- app.module.ts에서 위의 코드를 삭제해준다.

- TypeError: Class constructor JwtMiddleware cannot be invoked without 'new'
  에러가 발생한다.
- repository, class, dependency injection(DI)를 사용할 때 Middleware를 app.use()에 넣을 수 없다.
- main.ts에서 app.use()는 클래스(class) 컴포넌트(component)는 사용할 수 없고, 함수(Function) 컴포넌트(component)만 사용 가능하다.

```
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: '/graphql', method: RequestMethod.ALL });
  }
}
```

- app.module.ts에서 이전과 같이 입력한다.

```
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(JwtMiddleware); // delete
  await app.listen(3000);
}
bootstrap();
```

- main.ts에서 app.use(JwtMiddleware) 삭제한다.
- functional middleware은 middleware를 어디서든 사용할 수 있고, class middleware는 app.module.ts Appmodule에서 implements NestModule 해주고, 설정 해야 한다.

```
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      console.log(req.headers['x-jwt']);
    }
    next();
  }
}
```

- jwt.middleware.ts에서 headers에서 token을 추출한다.

```
{
  me{
    email
  }
}
```

- localhost:3000/graphql을 확인해보면 eyJh~~~blablabla 토큰 값이 콘솔로 출력되는 것을 확인할 수 있다.

```
 const token = req.headers['x-jwt'];
```

- jwt.middleware.ts에서 console.log(req.headers['x-jwt'])를 const token = req.headers['x-jwt'];로 변경한다.
- jwt.middleware.ts에서 토큰(token)을 저장(save)한다.
- jwt.middleware.ts에서 토큰(token)을 검증(verify), 해독(decrpt)한다.
- https://www.npmjs.com/package/jsonwebtoken (jwt.verify(token, secretOrPublicKey, [options, callback]), jwt.decode(token [, options]) 검색)
- verify()를 이용해 올바른 토큰인지 확인하고, verify()는 해독(decrpt)된 token을 준다.
- decode()는 (Synchronous) Returns the decoded payload without verifying if the signature is valid. (동기) 서명이 유효한지 확인하지 않고 디코딩된 페이로드를 반환한다.

```
@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {}
  sign(userId: number): string {
    return jwt.sign({ id: userId }, this.options.privateKey);
  }
  verify(token: string) {
    return jwt.verify(token, this.options.privateKey);
  }
}
```

- jwt.service.ts에서 jwt.verify에 token, secretOrPublicKey는 this.options.privateKey를 준다. sign() 안에 { id: userId }는 userId + ''로 string type으로 만들어줄 수 있지만, object type{}으로 그대로 둔다.

- jwt.service.ts에서 verify(token: string, secretOrPublicKey: jwt.Secret, options?: jwt.VerifyOptions): jwt.JwtPayload (+4 overloads)라고 되어 있는데 강의에서 보면 string | object를 반환한다고 나와있다. 왜 jwt.JwtPayload를 반환하게 되어 있을까?

```

export interface JwtPayload {
[key: string]: any;
iss?: string | undefined;
sub?: string | undefined;
aud?: string | string[] | undefined;
exp?: number | undefined;
nbf?: number | undefined;
iat?: number | undefined;
jti?: string | undefined;
}

```

- JwtPayload를 봐도 string | object 가 없다. why? vscode 확장 프로그램이 없나? 아니면 jsonwebtoken 버전 업데이트 되어서 바뀐 것 같다.

- string | object 반환하니까 jwt.middleware.ts에서 확인한다.

```
@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      const decoded = this.jwtService.verify(token.toString());
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        console.log(decoded.id);
      }
    }
    next();
  }
}
```

- jwt.middleware.ts에서 Injectable일 때만 inject 할 수 있다. @Injectable가 없으면 DI(dependency injection)하기 어렵다.

```
      const token = req.headers['x-jwt'];
```

- jwt.middleware.ts에서 token은 const token: string | string[]인 이유는 타입스크립트는 어떤 header나 array가 될 수 있기 때문이다.

```
 constructor(private readonly jwtService: JwtService) {}
```

- Injectable일 때만 inject 할 수 있다.

```
      const decoded = this.jwtService.verify(token.toString());
```

- 항상 string type이라고 확신할 수 있게 toStirng()을 만들어준다.
- https://wjdtn7823.tistory.com/76 (toString() 검색)

```
  if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        console.log([decoded.id]);
      }
```

- string이나 object기 때문에 decoded.id 같은 형식이 작동하지 않는다.
- object거나 hasOwnProperty()에 id가 있고, ture라면 [decoded.id]를 출력한다.
- 요청(request)을 보내서 토큰(token)을 보낸 사람의 id를 볼 수 있는지 확인한다.
- https://hianna.tistory.com/401 (typeof 검색)

```
{
  me{
    email
  }
}
```

- localhost:3000/graphql에서 실행해보면 "message": "Cannot return null for non-nullable field Query.me." 에러가 발생하지만, console에는 { 0 }, decoded.id로 출력하면 0이라는 id 값이 보인다.

```
  async findById(id: number): Promise<User> {
    return this.users.findOne({ id });
  }
```

- id를 가지고 user를 찾기 위해 users.service.ts에 입력한다.
- 비동기 실행은 바로 하되 결과값은 나중에 받는 객체 Promise<User>와 findOne id값을 return해준다.
- https://codingsalon.tistory.com/57 (Promise 검색)

```
    private readonly usersService: UsersService,
```

- jwt.middleware.ts에서 JwtMiddleware에 users.service.ts가 필요하기 때문에 UsersService를 넣어준다.
- Error: Nest can't resolve dependencies of the UsersService (UserRepository, JwtService, ?). Please make sure that the argument Object at index [2] is available in the UsersModule context. UsersService를 못 찾는 다는 에러와 함께 많은 에러가 발생한다.

```
      exports: [JwtService] // don't put this
```

- jwt.middleware.ts에서 JwtService는 jwt.module.ts에서 module에 의해 export되고, global이기 때문에 쉽게 찾을 수 있다.
- jwt.middleware.ts에서 UsersService는 누가 가지고 있을까?
- users.module.ts에서 UsersModule을 가지고 있다.
- 하지만 users.module.ts에서 UsersService은 export 되고 있지 않다.

```
exports: [UsersService], // put this
```

- users.module.ts에서 UsersService를 exports해준다.
- UsersService를 exports 되지 않았기 때문에 사용할 수 없었다.

```
async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      const decoded = this.jwtService.verify(token.toString());
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        // console.log(decoded.id);
        try {
          const user = await this.usersService.findById(decoded['id']);
          console.log(user);
        } catch (e) {}
      }
    }
    next();
  }
```

- jwt.middleware.ts에서 console.log(decoded.id) 대신에 try/catch, async/await 해준다.
- findById는 users.service.ts에 있는 함수(function)이다.
- findOne은 typeorm을 import 해서 제공되는 함수(function)이다.
- console.log(user)로 출력한다.

```
{
  me{
    email
  }
}
```

```
User {
  id: 0,
  createdAt: 2022-01-12T12:27:09.403Z,
  updatedAt: 2022-01-12T12:27:09.403Z,
  email: 'kim@kim.com',
  password: '$2b$~~~blablabla',
  role: 0
}
```

- localhost:3000/graphql을 확인해보면 User 값이 콘솔로 출력되는 것을 확인할 수 있다.

```
if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      const decoded = this.jwtService.verify(token.toString());
```

- header

```
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
```

- DI(depency injection)
- Middleware에서 header, DI(depency injection)를 이용해 User를 찾을 수 있다.

```
async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      const decoded = this.jwtService.verify(token.toString());
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        try {
          const user = await this.usersService.findById(decoded['id']);
          console.log(user); // delete
          req['user'] = user;
        } catch (e) {}
      }
    }
    // next()를 호출하면 next handler가 request user를 받는다.
    next();
  }
```

- console.log(user)를 지워주고, 사용자(user)에게 요청(request)한다.
- 5.8에서는 next()를 호출하면 next handler가 request user를 받는다.

# Git

- git #5.8로 해서 #5.7로 이름 변경하려고 했는데 reset HEAD 명령어로 삭제해버렸다. 다시 reflog로 복구했다.
- git reflog -> git checkout c41b39 -> git branch backup -> git checkout backup
- https://velog.io/@sonypark/reset-hard%EB%A1%9C-%EC%82%AD%EC%A0%9C%ED%95%9C-%EC%BB%A4%EB%B0%8B-git-reflog%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%B4-%EC%82%B4%EB%A6%AC%EA%B8%B0 (reset --hard로 삭제한 커밋 git reflog 검색)
- git checkout master -> #5.8 cherry pick up -> git merge backup
  https://mongyang.tistory.com/m/174 (git merge 검색)
- master로 가서 5.8 코드를 가져오고, backup에서 readme.md를 master와 merge해서 master로 통합했다.

# 5.8

```
  req['user'] = user;
```

- 인증(authentication) 부분에서 jwt.middleware.ts에서 위 코드를 graphql로 request를 공유하게 해야 한다.
- 위 코드에서 req는 HTTP request와 비슷한 것인데, graphql resolver로 전달해줘야 한다.

```
import { ApolloServerBase } from 'apollo-server-core';
```

- app.module.ts에서 GraphQLModule에서 'apollo-server-core'에서 모든 것을 가져와 사용할 수 있다.
- https://github.com/apollographql/apollo-server (apollographql 검색)
- Context A request context is available for each request
  context는 각 request(req)에서 context를 사용할 수 있습니다.
- context is defined as a function, it will be called on each request and will receive an object containing a req property, which represents the request itself.
  context가 함수로 정의되면 매 request마다 호출된다. 이것은 req property를 포함한 object를 Express로부터 받는다.

```
new ApolloServer({
  typeDefs,

  resolvers: {
    // resolver 내부
    Query: {
      books: (parent, args, context, info) => {
        console.log(context.myProperty); // Will be `true`!
        return books;
      },
    }
  },
  // context에 myProperty 넣음
  context: async ({ req }) => {
    return {
      myProperty: true
    };
  },
})
```

- context에 property를 넣으면 resolver 내부에서도 사용할 수 있다.
- apollo server, graphql은 context를 가지고 있다.
- 어떤 context를 지정해도 resolver에서 확인할 수 있다.

```
          req['user'] = user;
```

- user는 req라는 request property가 있기 때문에 모든 resolver에서 공유 가능하다.

```
  context: async ({ req }) => {
    return {
      myProperty: true
    };
  },
```

- apollo-server 문서

```
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({ req }) => ({tomato:true})
    }),
```

- app.module.ts에서 apollo-server 문서와 비슷한 형식으로 만들어주고 tomato는 모든 resolver에서 공유할 수 있다.

```
      context: ({ req }) => ({user: req['user']})
```

- app.module.ts에서 context를 다음과 같이 지정할 수 있다. req는 이미 user를 가지고 있다.
- req['user']를 graphql resolver의 context로 공유한다.

```
  @Query((returns) => User)
  me(@Context() context) {
    console.log(context)
  }
```

- users.resolver.ts에서 context를 가져온다.

```
{
  me{
    email
  }
}
```

- localhost:3000/grpahql에서 위의 코드를 보내면 아무것도 return 하지 않아서 "message": "Cannot return null for non-nullable field Query.me." 에러가 발생한다.

```
 user: User {
    id: 0,
    createdAt: 2022-01-12T12:27:09.403Z,
    updatedAt: 2022-01-12T12:27:09.403Z,
    email: 'kim@kim.com',
    password: '$2b$~~~~blabla',
    role: 0
  },
```

- 콘솔에는 user에 값이 나온다.

```
    .apply(JwtMiddleware)
      .forRoutes({ path: '/graphql', method: RequestMethod.POST });
      // ALL -> POST
```

- http://localhost:3000/graphql에서 headers로 token을 보내고, 보낸 token은 request로 보낸다. 보낸 request는 app.module.ts 위 코드에서 멈추고, JwtMiddleware가 먼저 받는다. ALL -> POST로 변경한다.

```
          req['user'] = user;
```

- jwt.middleware.ts에서 JwtMiddleware는 token을 찾고 위의 코드와 같이 request user로 넣어준다.
- request(req)안에 user라는 새로운 것을 만들어 주었다.
- forRoutes에서는 ALL 대신 POST로 보낸다.

```
      context: ({ req }) => ({user: req['user']})
```

- app.module.ts GraphQLModule에서 context는 각 요청(request)에서 context를 사용할 수 있다고 하는 apollo 내부 문서와 같이 context가 안으로 들어간다.

```
({ req })
```

- context로 함수를 호출하면 HTTP request(req) 프로퍼티가 주어진다.

```
  @Query((returns) => User)
  me(@Context() context) {
    console.log(context); // delete
    if (!context.user) {
      return;
    } else {
      return context.user;
    }
  }
```

- 그리고 나서 resolver는 context에 접근할 수 있게 된다.

```
  me(@Context() context)
```

- 매번 request 마다 context 받는다.

```
if (!context.user) {
      return;
    }
```

- user가 없으면 넘어간다.

```
else {
      return context.user;
    }
```

- user가 있다면 에러를 보여준다.

- 이렇게 하는 건 별로기 때문에 모든 resolver에다 구현하지 않는다. 그렇기 때문에 guard라는 방패같은 concept가 있는데 request를 멈추게 한다.
- https://docs.nestjs.kr/guards (nestjs guards 검색)
- https://jakekwak.gitbook.io/nestjs/overview/guards (nestjs 한국어 guards)

# 5.9

- authorization module을 만든다.
- nest g mo auth (vscode 터미널)

```
imports: [
   CommonModule,
  ],
```

- jwt 모듈은 이제 변경할 필요 없고, app.module.ts CommonModule도 필요 없을 것 같기 때문에 imports에서 지운다.
- auth module에서 guard를 만든다.
- auth 폴더에서 auth.guard.ts파일을 만든다.
- guard는 function인데 request를 다음 단계로 진행할지 말지 결정한다.
- @Injectable()을 사용하여 middleware처럼 guard를 만든다.

```
import { CanActivate, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGaurd implements CanActivate {}

```

- CanActivate는 ture를 return하면 request로 진행하고, false로 return하면 request를 멈추게 한다.

- CanActivate는 canActivate function 하나 밖에 없다
- CanActivate는 ExecutionContext를 주는데, request의 context에 접근하게 해준다.
- the current request pipeline. graphql의 context가 아니라 현재의(current) pipeline의 context를 연결할 수 있게 해준다. 즉, request의 context이다.

```
@Injectable()
export class AuthGaurd implements CanActivate {
  canActivate(context: ExecutionContext) {
    console.log(context);
    return false;
  }
}

```

- guard를 어디서 사용하든, false를 return하기 때문에 request를 막는다.

```
  me(@Context() context) {
    if (!context.user) {
      return;
    } else {
      return context.user;
    }
  }
```

- users.resolver.ts에서 위 코드를 지워준다.

```
  @Query((returns) => User)
  @UseGuards(AuthGaurd)
  me() {}
```

- users.resolver.ts에서 guard를 사용할 때 @UseGuards()와 안에는 AuthGaurd를 import해서 넣어준다.

```
{
  me {
    email
  }
}
```

- localhost:3000/graphql에서 auth.guard.ts에서 console.log()로 context를 확인하고 false를 return하는지 본다.
- "message": "Forbidden resource",에러 메세지가 발생한다. reslover로 잘 전송되는 것과 false를 return하는 것을 알 수 있고 console로 출력이 된다.
- authorization(auth)으로 추가하는 게 끝났다.

```
    return true;
```

- "message": "Cannot return null for non-nullable field Query.me." 에러메세지가 나온다.
- auth.guard.ts에서 true로 return하면 다음 단계로 진행 할 수 있다.

```
  { user: undefined, req: [IncomingMessage] },
```

- console 값에 user가 undefined으로 뜨는 것을 볼 수 있다.
  이건 HTTP headers에 localhost에 x-jwt token 값을 입력해주지 않아서 뜨지 않았다.

```
{
  "x-jwt": "eyJh~~~ blablabla"
}
```

```
    { user: [User], req: [IncomingMessage] },
```

- 위의 token 값을 입력해주면 위의 값이 뜨는 것을 볼 수 있다.
- context가 http로 되어 있기 때문에 graphql로 바꿔야 한다.

```
    const gqlContext = GqlExecutionContext.create(context).getContext();
    console.log(gqlContext);
```

- auth.guard.ts에서 gqlContext를 변수로 선언하고, GqlExecutionContext, create안에는 params로 context 넘겨주고, getContext()를 호출한다. 그리고 console.log로 gqlContext 변수를 출력한다.

```
{
  me {
    email
  }
}
```

```
{
  user: User {
    id: 0,
    createdAt: 2022-01-12T12:27:09.403Z,
    updatedAt: 2022-01-12T12:27:09.403Z,
    email: 'kim@kim.com',
    password: '$2b$~blabla',
    role: 0
  },
```

- localhost:3000/graphql로 출력시키면 graphql context를 볼 수 있다.
- 그리고 user를 다시 가져올 수 있게 되었다.

```
    const gqlContext = GqlExecutionContext.create(context).getContext();
    console.log(gqlContext); // delete
    const user = gqlContext['user'];
    console.log(user);
```

- 가져온 user를 console.log로 출력해본다.

```
User {
  id: 0,
  createdAt: 2022-01-12T12:27:09.403Z,
  updatedAt: 2022-01-12T12:27:09.403Z,
  email: 'kim@kim.com',
  password: '$2b$1~~~blabla',
  role: 0
}
```

- user 안에 User 정보만 출력되는 것을 볼 수 있다.

```
    const user = gqlContext['user'];
    console.log(user); // delete
    if (!user) {
      return false;
    }
```

- user가 없으면 false로 출력하고 있으면 true로 출력한다. 이렇게 gaurd를 만든다.
- 에러 메세지 "message": "Cannot return null for non-nullable field Query.me."가 정상적으로 나온다.
- user가 인증(authentication)되었는지 확인해본다.

```
  @Query((returns) => User)
  @UseGuards(AuthGaurd)
  me() {}
```

- 에러메세지로 유추해봤을 때, me()까지는 동작한다는 뜻이다.

```
{
  me {
    email
  }
}
```

- 구글 시크릿 모드로 localhost:3000/graphql를 열고, 위 코드를 입력해주면,
  "message": "Forbidden resource"라는 에러메시지가 나온다.

```
  @UseGuards(AuthGaurd)
```

- guard를 이용하면 어떤 end point(소프트웨어나 제품에 최종목적지인 사용자)를 보호할 수 있다.
- https://securitycream.tistory.com/7 (end point 검색)
- guard 말고도 user를 허용(authorize)하는 더 좋은 방법이 있다고 한다.
- 인증(authentication)은 누가 resource를 요청하는 지 확인하는(knowing) 과정이다. token으로 identity(신원)을 확인한다.
- 허가(authorization)은 user가 무슨 일을 하기 전 permission을 가지고 있는지 확인하는 과정이다.
- 허가(authorization)은 예를 들어 user.entity.ts에서 User에 Client, Owner, Delivery 등 다른 Role들이 있다. Client는 많은 일을 할 수 있고, Owner은 레스토랑(resturant) module을 만들고, Delivery는 레스토랑(resturant) module을 만들지 않는다.

```
  @UseGuards(AuthGaurd)
```

- 허가(authorization)를 구현할 때는 gaurd 보다 좋게 users.resolver.ts 위 코드랑 비슷하게 한다.

```
 async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    try {
      return await this.usersService.login(loginInput);
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
```

- Gaurd도 각기 다른 기능을 하는 Gaurd를 만들 수 있어서 좋다.
- 위 코드와 같이 loginGaurd라는 user가 인증(authentication)이 되었는지 아닌지 확인할 수 있는 publicOnly 같은 guard를 만들 수 있다.

```
  @UseGuards(AuthGaurd)
```

- 위 코드는 AuthGaurd를 LoginOnlyGuard라고 부를 수도 있다.
- 이런식으로 user가 로그인 유무 guard와 user가 인증 유무 guard랑 따로 따로 만들어서 확인할 수 있는 것 같다.
- restaurant를 다룰 때 누가 client이고, Delivery person, restaurant Owner인지 알아야 할 때 guard를 다시 사용한다.
- users.resolver.ts에서 위 코드 하나로 resolver를 보호하기 때문에 guard가 좋은 기능인 것 같다.

# #5.10

```
  me() {}
```

- users.resolver.ts에서 login이 되어 있지 않으면 request를 멈추게 한다.
- me(), resolver에서 request를 보내고 있는 주체를 알아야 한다.

```
 @Args('input')
```

- request를 누가 보내고 있는지 알기 위해서 users.resolver.ts에서 위의 Argument를 위한 decorator(@)처럼 User를 위한 decorator(@)를 직접 만든다.
- auth 폴더에 auth-user.decorator.ts파일을 만든다.

```
export const AuthUser = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
    console.log(context); // delete
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user = gqlContext['user'];
    console.log(authUser) // delete
    return user;
    }
);
```

- createParamDecorator은 factory()은 data: unknown, context: ExecutionContext가 필요하다.

```
{
  me {
    email
  }
}
```

- localhost:3000/graphql로 console.log(context)로 context를 콘솔로 찍어본다.
- auth.guard.ts guard에 GqlExecutionContext, user가 있기 때문에 const gqlContext, const user를 users.resolver.ts에 넣고, user를 찾고, user에서 찾은 것을 return한다.

```
  me(@AuthUser() authUser: User) {
    console.log(authUser)
  }
```

- users.resolver.ts에서 @AuthUser를 import 해준다. authUser는 type이 User를 return 해준다. authUser를 console에 출력한다.

```
{
  me {
    email
  }
}
```

- localhost:3000/graphql에서 console에서 User를 확인하면 정상적으로 값이 나오는 것을 확인할 수 있다.

```
  me(@AuthUser() authUser: User) {
    console.log(authUser) // delete
    return authUser;
  }
```

- return authUser를 해준다.

```
{
  me {
    email
  }
}
```

```
{
  "data": {
    "me": {
      "email": "kim@kim.com"
    }
  }
}
```

- localhost:3000/graphql에서 data로 값이 출력되는 것을 확인 할 수 있다.

```
  me(@AuthUser() authUser: User) {
    return authUser;
  }
```

- auth-user.decorator.ts로 어떤 것을 return 하여도 users.resolver.ts에서 authUser로 받아질 수 있다. authUser은 어떤 이름이나 지을 수 있다.

- 허가(authorization)는 예를 들어 delivery guy인 경우에만 혹은 restaurant owner인 경우에 특정 resolver를 보여주는 식으로 할 수 있다. 이 때 metadata를 사용한다.

# #5.11

- authentication은 x-jwt 같은 header은 token을 보내고 있다.
- header은 http 기술을 쓰기 위해 middleware를 만든다.
- jwt.middleware.ts middleware는 header을 가지고, jwt.service.ts에서 jwtService.verify()를 사용한다.

```
  (typeof decoded === 'object' && decoded.hasOwnProperty('id'))
```

- jwt.middleware.ts id를 찾게되면, userService를 사용한다.

```
  const user = await this.usersService.findById(decoded['id']);
```

- usersService를 사용해서 id를 가진 user를 찾는다.

```
  async findById(id: number): Promise<User> {
    return this.users.findOne({ id });
  }
```

- usersService는 typeorm의 findOne()를 사용하는 findById()를 가지고 있다.

```
  req['user'] = user
```

- db에서 user를 찾으면 user를 request object에 붙여서 보낸다.
- middleware가 원하는대로 request object를 바꿀 수 있다.
- middleware에 의해 바뀐 request object를 모든 resolver에서 사용할 수 있다.
- token이 없거나 에러가 있거나, user를 token으로 찾을 수 없다면 request에 어떤 것도 붙이지 않았다.

```
   const decoded = this.jwtService.verify(token.toString());
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        try {
          const user = await this.usersService.findById(decoded['id']);
          req['user'] = user;
        } catch (e) {}
      }
    }
```

- http://localhost:3000에서 header에 x-jwt안에 token을 제대로 붙이지 않았을 때, ERROR [ExceptionsHandler] invalid signature이라는 에러가 발생한다.

```
     try {
        const decoded = this.jwtService.verify(token.toString());
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const user = await this.usersService.findById(decoded['id']);
          req['user'] = user;
        }
      } catch (e) {}
    }
```

- try/catch 구문을 decoded 밖에 넣어줬어야 한다.
- 그래야 http://localhost:3000에서 "message": "Forbidden resource"라는 원하는 값을 보여준다.

```
  req['user'] = user;

```

- decoding에 실패하면 request(req)에 아무것도 안 붙인다.
- try 안에 decoded가 있기 때문이다.

```
  context: ({ req }) => ({ user: req['user'] }),
```

- app.module.ts에서 context는 apollo, graphql server의 context는 모든 resolver에 정보를 보낼 수 있는 프로퍼티(property)이다. context 모든 request를 가져오고 호출한다. {req}는 user key['user']를 가진 http에 해당한다.
- context()을 만들면 function이 {req}를 준다. JwtMiddleware를 거치고, grapql context에 req['user']을 보낸다. context user로 본다.
- users.resolver.ts를 보면 guard가 있는데, guard는 function을 보충해준다.
  auth.guard.ts를 보면 canActive가 있는데 boolean으로 false나 true를 return한다.

  ```
    canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user = gqlContext['user'];
  ```

- context는 nestjs ExecutionContext이다. ExecutionContext를 가져다가 GqlExcutionContext로 바꿔야 한다.
- graphql의 getContext가 있다. gqlContext는 context: ({ req }) => ({ user: req['user'] })와 같다.

```
    // context에서 user를 찾는다.
    const user = gqlContext['user'];
    // user가 있다면 true, 없다면 false
    if (!user) {
      return false;
    }
    return true;
  }
```

- context에서 user를 찾는다. user가 있다면 true, 없다면 false로 return한다.

- sending header token -> decrypt token -> verify middleware -> add user request object(req['user']) -> graphql context -> guard find gqlContext if user true or false return -> guard authorize -> users.resolver.ts graphql context-> auth-user.decorator.ts @AuthUser take context -> gqlContext -> user return

```
 me(@AuthUser() authUser: User) {
    return authUser;
  }
```

- users.resolver.ts에서 decorator는 value를 반환한다. value는 authUser, value type은 User이다.
- 따라서 컨텍스트(context) 핸들러는 http 요청에서 요청(req) 객체를 가져와 사용자(user) 정보를 추출하고 이를 AuthGuard에서 처리할 컨텍스트(context) 객체에 제공한다.

# #5.12

- 2개의 query를 추가해본다. query 하나, mutation 하나를 추가한다.

```
 @UseGuards(AuthGaurd) // end point를 보호한다.
  @Query((returns) => User)
  user(id) {
    return;
  }
```

- users.resolver.ts에 user의 profile을 볼 수 있는 query를 추가한다.
- @UseGaurds end point(소프트웨어나 제품에 최종목적지인 사용자)를 사용하여 보호한다.

```
loginInput: LoginInput): Promise<LoginOutput>
```

- 위와 같이 통일 되서 보기 좋게 input/output 형식으로 작성해본다.
- users 폴더 안에 dtos 폴더 안에 user-profile.dto.ts파일을 만들어 준다.
- user-profile.dto.ts파일은 create-account.dto.ts파일과 비슷하다.

```
@ArgsType()
export class UserProfileInput {
  @Field((type) => Number) // id는 Number로 한다.
  userId: number;
}
```

- user-profile.dto.ts파일에서 UserProfileInput 이름 짓고 다음과 같이 dto를 만들어준다.

```
  @UseGuards(AuthGaurd)
  @Query((returns) => User)
  userProfile(@Args() userProfileInput: UserProfileInput) {
    return this.usersService.findById(userProfileInput.userId);
  }
```

- users.resolver.ts에서 user(id)를 userProfile(@Args())로 변경해주고,
  userProfileInput를 import, 추가해주고, type은 UserProfileInput로 해준다.
- 나도 손가락 날라가며 코딩하고 싶다ㅋㅋ

```
  userProfile(@Args() userProfileInput: UserProfileInput) {
    return this.usersService.findById(userProfileInput.userId);
  }
```

- user을 userProfile로 변경해준다.
- userProfileInput을 만들고 이제 return 해줘야 한다.
- findById는 token을 위해 만든 function이다.
- UserProfileInput에서 userId를 찾는다.

```
{
  me {
    id
    email
  }
}
```

- localhost:3000/graphql에서 id를 찾아봤는데 "message": "Cannot query field \"id\" on type \"User\"." user에 id가 없다는 에러메세지가 나온다.

```
userProfile(
userId: Float!
): User!
type User {
email: String!
password: String!
role: UserRole!
}
```

- user에는 email, password, role 밖에 없다.
- common 폴더 안에 entities 폴더에서 core.entity.ts파일에 @ObjectType이 없어서 에러가 발생했다.

```
userProfile(
userId: Float!
): User!
type User {
id: Float!
createdAt: DateTime!
updatedAt: DateTime!
email: String!
password: String!
role: UserRole!
}
```

- 새로고침하면 id, createdAt, updatedAt 등 새로운 게 나온다.

```
{
  "data": {
    "me": {
      "id": 0,
      "email": "kim@kim.com"
    }
  }
}
```

- 그리고 정상적으로 id 값과 email이 나오는 것을 확인할 수 있다. 안되면 만료된 토큰 일수도 있으니 다시 생성해서 넣어보자.

```
{
  userProfile(userId:0) {
    id
    email
  }
}
```

```
{
  "data": {
    "userProfile": {
      "id": 0,
      "email": "kim@kim.com"
    }
  }
}
```

- 위의 것으로 해도 data가 정상적으로 출력되는 것을 확인할 수 있다.

```
{
  userProfile(userId:1) {
    id
    email
  }
}
```

- id가 0 말고도 1,2 등 다른 것은 못 찾는다.
- user인데 못찾는 것 일 수도 있기 때문에 에러를 handle 한다.

```
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
```

- 그렇기 때문에 users.resolver.ts에서 위의 LoginOutput과 같이 output을 사용한다.

```
export class LoginOutput extends MutationOutput
```

- loginOutput은 위에서 MutationOutput을 extends 한 것과 같이 user-profile.dto.ts에도 적용한다.

- login.dto.ts에서는 MutationOutput을 extends하면 error와 ok를 사용할 수 있다.
- common 폴더 안 entities 폴더 안에 output.dto.ts파일에서 Mutation에서만 사용하는 것이 아니기 때문에 MutationOutput 보다는 CoreOutput로 이름을 변경한다.

```
export class LoginOutput extends CoreOutput
```

- users 폴더 안 dtos 폴더 안에 login.dto.ts에도 CoreOutput으로 변경해준다.

```
export class createAccountOutput extends CoreOutput {}
```

- users 폴더 안 dtos 폴더 안에 create-account.dto.ts에도 CoreOutput으로 변경해준다.
- macbookkim 님 MutationResponse를 선언한 곳에서 F2를 누르고 변수명을 바꾸면 MutationResponse를 사용하는 곳에서도 변수명이 바뀌어요.신.기.하.다
- CoreOutput은 error, ok를 가지고 있다.

```
@ObjectType()
export class UserProfileOutput extends CoreOutput {
  @Field((type) => User)
  user: User;
}

```

- user-profile.dto.ts에서 @ArgsType 아래에 @ObjectType Output도 추가로 작성해준다.
- @Field type을 User로, user는 type을 User로 가진다.

```
  @Query((returns) => UserProfileOutput)

```

- users.resolver.ts에서는 UserProfileOutput을 return하고 Promise는

```
  userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
  }
}
```

- users.resolver.ts에서 Promise는 UserProfileOutput으로 준다.

```
  async userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    try {
      const user = await this.usersService.findById(userProfileInput.userId);
    } catch (e) {
      return {
        error: 'User Not Found',
        ok: false,
      };
    }
  }
```

- 'user' 속성이 '{ error: string; ok: false; }' 형식에 없지만 'UserProfileOutput' 형식에서 필수입니다.ts(2741)
  user-profile.dto.ts(14, 3): 여기서는 'user'이(가) 선언됩니다. 라는 빨간줄이 뜬다.

  ```
    @Field((type) => User, { nullable: true })
    user?: User;
  ```

- user-profile.dto.ts에서 user에 nullable을 붙여준다.
- 어떨 땐 user를 찾지만, 어떨 때는 못 찾기 때문이다.
- { nullable: true }도 잊지 말고 써준다.
- users.resolver.ts에서 user을 보면 findById users.service.ts로 이동 findOne을 보면 Entity | undefined이다.

```
    return {
        ok: Boolean(user),
        user,
      };
```

- users.resolver.ts에서 (user)를 찾으면 ok가 true, undefined이면, false로 출력한다. 처음보는 신기한 형태다.

```
{
  userProfile(userId:1) {
    id
    email
  }
}
```

- localhost:3000/graphql에 그대로 입력하면 "message": "Cannot query field \"id\" on type \"UserProfileOutput\".", UserProfileOutput type에 id field를 query 하지 못한다고 에러메세지가 나온다.

```
{
  userProfile(userId:1) {
    ok
    error
    user{
      id
    }
  }
}
```

- localhost:3000/graphql에 입력한다.

```
{
  "data": {
    "userProfile": {
      "ok": false,
      "error": null,
      "user": null
    }
  }
}
```

- 다음과 같은 데이터 값이 나온다.

```
    if (!user) {
        throw Error();
      }

     return {
        error: 'User Not Found',
        ok: false,
      };
```

```
 // user 못 찾으면 return 쪽으로 보냄
      if (!user) {
        throw Error();
      }
      return {
        ok: true,
        user,
      };
    } catch (e) {
      // user 못 찾으면 여기로 보냄
      return {
        error: 'User Not Found',
        ok: false,
      };
    }
```

- user 못 찾으면 return 쪽으로 보내고, error 값이 출력된다.

```
{
  "data": {
    "userProfile": {
      "ok": true,
      "error": null,
      "user": {
        "id": 0
      }
    }
  }
}
```

- user 값은 id를 0을 보냈다. 잘못 보냈을 때는 "error": "User Not Found"가 출력되고 정상적으로 작동한다.

# #5.13

- user profile을 수정한다.

```
  @UseGuards(AuthGaurd)
  @Mutation(returns => );
```

- users.resolver.ts에서 @UseGuards(AuthGaurd)를 가져오고 @Mutation 해주고 return을 해줘야 하는데 dto, MutationOutput, MutationInput이 없다.

```
@ObjectType()
export class EditProfileOutput extends CoreOutput {}
```

- users 폴더 안에 dtos폴더에서 edit-profile.dto.ts파일을 만들어준다.
- @ObjectType()를 넣어주고, EditProfileOutput 이름 짓고 error, ok 넘겨주는 CoreOutput를 extends 해준다.

```
  @UseGuards(AuthGaurd)
  @Mutation(returns => EditProfileOutput)
  editProfile()
```

- users.resolver.ts에서 EditProfileOutput를 가져온다.

```
  me(@AuthUser() authUser: User) {
    return authUser;
  }
```

- editProfile이 dto를 만들기 위해서는 EditProfileInput이 필요하고, me에서 만든 것과 같이 AuthUser과 필요하다.

```
  editProfile(
    @AuthUser() authUser: User,
  )
}
```

- users.resolver.ts에서 editProfile 안에 @AuthUser() authUser: User를 넣어준다.
- AuthUser는 현재 login한 사용자 정보를 준다.

```
@ObjectType()
export class EditProfileInput extends PickType(User, ['email', 'password']) {}
```

- edit-profile.dto.ts 아래에 추가 해준다.
- pickType은 user class에서 프로퍼티 선택하게 해주지만 EditProfileInput이기 때문에 어떨 때 email, password 수정, 둘 다, 둘 중 하나 수정하고 싶을 때가 있다.
- @ObjectType을 지운다.

```
@InputType()
export class EditProfileInput extends PartialType(
  PickType(User, ['email', 'password']),
) {}

```

- 그래서 PartialType, PickType 둘 다 사용한다.
- User에서 email, password를 가지고 class 만들고, PartialType으로 optioal하게 만든다.
- @InputType()으로 써준다.

```
  editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {}
}
```

- users.resolver.ts에서 login과 비슷하게 만들어준다.

```
  async editProfile(userId: number, { email, password }: EditProfileInput) {
    return this.users.update();
  }
```

- users.service.ts에서 update()는 entity를 부분적으로 update()한다. db에 entity 유무를 체크하지 않는다.
- user가 db에 없어도 login한 경우가 아니면 user service에서 editProfile을 실행할 수 없기 때문에 update()를 사용한다. userId는 token에서 오고, graphql에 오지 않는다.
- user 존재 유무를 확인하지 않고, 쿠키에서 데코레이터가 주는 userId를 문제 없다고 신뢰하기 때문에 update()한다.
- update()는 graphql input으로 userId로 받아오지 않기 때문에 신뢰할 수 있다. 데이터가 존재하든 말든 update()해서 빠르다.

```
(criteria: string | number | Date | ObjectID | FindConditions<User> | string[] | number[] | Date[] | ObjectID[], partialEntity: QueryDeepPartialEntity<User>: Promise<UpdateResult>;)
```

```
  async editProfile(userId: number, { email, password }: EditProfileInput) {
    return this.users.update(userId, { email, password });
  }
```

- users.service.ts에서 update의 criteria는 id와 userId를 object 형식으로 준다. userId에 해당하는 데이터를 찾는다. email, password를 찾는다.
- criteria는 다양한 타입(string 등) 을 보낼 수 있기 때문에 userId만 보내도 된다.
- 언제 update, object를 찾을 지, 만약 찾지 못한다면 에러를 보여주는 것이 중요하다.
- login 되어 있지 않으면, 누구도 editProfile을 호출할 수 없다.
- update()는 UpdateResult는 Promise를 return한다. update된 object를 return하는 것이 아닌, update 후 number of afefected row와 raw라고 하는 query가 반환하는 SQL grapql, affected, 그리고 생성된 data인 generatedMaps 의 값을 return한다.

```
  @UseGuards(AuthGaurd)
  @Mutation((returns) => EditProfileOutput)
  async editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      await this.usersService.editProfile(authUser.id, editProfileInput);
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
```

- users.resolver.ts에 try/catch, async/await를 적고, 위와 같이 입력해준다.

```
mutation {
  editProfile(input: {
    email: "good@naver.com"
  }) {
    ok
    error
  }
}
```

- localhost:3000/graphql에서는 email을 변경해본다.

```
{
  "errors": [
    {
      "message": "\"password\" 칼럼(해당 릴레이션 \"user\")의 null 값이 not null 제약조건을 위반했습니다.",
      "locations": [
        {
          "line": 4,
          "column": 5
        }
      ],
      "path": [
        "editProfile",
        "error"
      ],
```

- 위와 같이 에러가 발생하는 데 고쳐본다.

# #5.14

```
{
  "errors": [
    {
      "message": "\"password\" 칼럼(해당 릴레이션 \"user\")의 null 값이 not null 제약조건을 위반했습니다.",
      "locations": [
        {
          "line": 4,
          "column": 5
        }
      ],
      "path": [
        "editProfile",
        "error"
      ],
```

- column을 null로 만들려고 하고 있지만, column은 null이면 안된다.
- password를 보내지 않았기 때문에 colum에는 null value를 보내고 있다.
- dto가 어떻게 생겼는지 본다.

```
  async editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      console.log(editProfileInput);
      await this.usersService.editProfile(authUser.id, editProfileInput);
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
```

- users.resolver.ts에서 editProfileInput을 console.log()로 출력해본다.

```
mutation {
  editProfile(input: {
    email: "good@naver.com"
  }) {
    ok
    error
  }
}
```

- localhost에서 실행해보면 console에 찍히는 것을 확인할 수 있다.

```
[Object: null prototype] { email: 'good@naver.com' }
```

- 콘솔에 변경된 이메일을 출력하는 것을 알수 있다.

```
  async editProfile(userId: number, { email, password }: EditProfileInput) {
    console.log(userId, email, password);
    return this.users.update(userId, { email, password });
  }
```

- users.service.ts에서 userId, email, password를 console.log()한다.

```
0 good@naver.com undefined
```

- userId는 0, email good@naver.com이고, password는 undefined가 출력되는 이유는 { email, password } destructuring(구조 분해 할당), spread syntax(전개 구문
  )를 사용해서 그렇다.
- https://poiemaweb.com/es6-destructuring (destructuring 검색)
- https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Spread_syntax (spread syntax 검색)

```
 async editProfile(userId: number, editProfileInput: EditProfileInput) {
    console.log(userId, editProfileInput);
    // return this.users.update(userId, { email, password });
  }
```

- email, password 대신에 editProfileInput으로 변경하고 console.log( editProfileInput)로 본다.
- "message": "Cannot return null for non-nullable field Mutation.editProfile.",라는 다른 에러메시지가 나온다.

```
{ email: 'good@naver.com' }
```

- password가 안 보이고, email만 보인다.

```
    return this.users.update(userId, { ...editProfileInput });
```

- db로 undefined 된 데이터를 보내고 싶지 않기 때문에{ ...editProfileInput }해준다.

```
     return {
        ok: true,
      };
```

- users.resolver.ts에서 ok true return해준다.

```
mutation {
  editProfile(input: {
    email: "good@naver.com"
  }) {
    ok
    error
  }
}
```

```
{
  "data": {
    "editProfile": {
      "ok": true,
      "error": null
    }
  }
}
```

- localhost ok true 출력

```
{
	me {
    email
  }
}
```

```
{
  "data": {
    "me": {
      "email": "good@naver.com"
    }
  }
}
```

- me email도 가능

```
mutation {
  editProfile(input: {
    password: "12121212"
  }) {
    ok
    error
  }
}
```

```
mutation {
  editProfile(input: {
    password: "12121212"
  }) {
    ok
    error
  }
}
```

- password 변경도 가능, 하지만 not 해시화 (pgAdmin에서 비밀번호 노출 12121212)
- users.entity.ts @BeforeUpdate() 안됨

# 5.15

- users.entity.ts에서 hashpassword에서 @BeforeUpdate 아래에 @BeforeUpdate를 입력 해준다.
- BeforeUpdate는 특정 entity를 update해야 부를 수 있다.
- update는 entity 유무 확인하지 않는다 -> 직접 entity update ❌ -> 그냥 db를 query에 있기를 바라면서 보냄
- save는 entity가 db에 존재하지 않으면 생성(create) 혹은 insert 한다. db에 존재하면 update한다.

```
  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<User> {
    const user = await this.users.findOne(userId);
    if (email) {
      user.email = email;
    }
    if (password) {
      user.password = password;
    }
    return this.users.save(user);
  }
```

- db말고 js로 직접 entity를 update한다.

```
mutation {
  editProfile(input: {
    password: "13131313"
  }) {
    ok
    error
  }
}
```

- pgAdmin에서 해시화한 것을 확인할 수 있다.

```
mutation {
	login(input:{
      email: "good@naver.com",
        password: "13131313"
  }) {
    ok
    error
    token
  }
}
```

```
{
	me {
    email
  }
}
```

```
{
  "data": {
    "me": {
      "email": "good@naver.com"
    }
  }
}
```

- 다 잘 나온다.
- user을 create, read, update하는 것을 배웠다.
- 계정 삭제 delete는 직접 만들어보기
- email을 아무때나 수정가능하니까 verify를 해줘야한다. 그러려면 email 모듈을 만들어야 한다.

# #5.16

- 요약 부분 따로 메모 안함 just 강의 시청

# #6.0

- email verification
- users 폴더 안에 entities폴더에 verification.entity.ts파일을 만든다.

```
@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  // 인증코드 필요 verification code
  @Column()
  @Field((type) => String)
  code: string;

  // 일대일 관계 one-to-one relations
  @OneToOne((type) => User)
  @JoinColumn()
  user: User;
}
```

- verification.entity.ts에는 users.entity.ts에서 데코레이터를 복붙한다.
- CoreEntity는 id, createdAt, updatedAt 등을 가지고 있다.
- https://typeorm.io/#/one-to-one-relations (one-to-one relations 검색)
- 일대일 관계는 A가 B의 인스턴스를 하나만 포함하고 B가 A의 인스턴스를 하나만 포함하는 관계입니다.
- 즉, Verification entity가 오직 한 명의 User만 가질 수 있다. User도 마찬가지로 하나의 Verification만 가질 수 있다.
- 대부분이 One-to-many Many-to-one 관계를 사용한다. One-to-many는 한 명의 User는 예를 들어 여러개의 restaurants를 가질 수 있다. Photo도 많은 likes를 받을 수 있다.
- User가 필요하고, User가 가지고 있는 Verification을 가져오고 싶을 때는 User entity에 @JounColum을 사용한다.
- Verification을 얻어 Verification으로부터 User로 접근하고 싶으면 Verification entity에 @JounColum을 사용한다.

- 정리하자면
- User로부터 Verification에 접근하고 싶으면 @JounColum이 User쪽에 있어야 한다.
- Verification으로부터 User에 접근하려면 @JounColum이 Verification 쪽에 있어야 한다.

```
    TypeOrmModule.forRoot({
     entities: [User, Verification]
    }),
```

- app.module.ts에서 entities에 Verification을 추가해준다.
- pgAdmin4에서 code, updatedAt, createdAt 등 추가된 것을 확인할 수 있다.

```
  @Column({ default: false })
  @Field((type) => Boolean)
  verified: boolean;
```

- users.entity.ts에서 User의 email이 검증(verified) 확인 유무를 저장해야 하기 때문에 추가해준다.

# #6.1

- 계획은 users.resolver.ts에서 usersService의 createAccount에서 verification을 만든다.

```
  imports: [TypeOrmModule.forFeature([User, Verification])],
```

- users.module.ts에서 TypeOrmModule의 forFeature에 User와 Verification이 들어가 있다.

```
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
```

- users.service.ts에서 새로운 Verification Repository를 만들어준다.

```
      // create, save한 것을 user에 가져온다.
      const user = await this.users.save(
        this.users.create({ email, password, role }),
      );
      // user를 create하고 save하고 있음
      await this.verifications.save(
        this.verifications.create({
          user,
        }),
      );
```

- users.service.ts에서 작성하고 const user 해서 생성하고 가져온다.
- verification은 code가 필요로 한다.
- verification.entity.ts에서 훅(Hook)을 생성한다.
- @BeforeInsert()는 엔터티 삽입(insert) 전에 이 데코레이터가 적용되는 메서드를 호출합니다.

```
  // code 생성하는 곳에 하는 이유는 다른 곳에도 verification 생성 가능하게 함
  @BeforeInsert()
  createCode(): void {
    // js에서 랜덤 코드는 어떻게 생성할까? -> uuid, Math().random()
    this.code = 'random code';
  }
```

- verification.entity.ts에서 @BeforeInsert()와 void로 createCode()를 실행해준다.
- 위의 코드가 없으면 DB에 에러가 발생한다. code는 null이면 안되고, 무조건 값을 가지고 있어야 하는 Column이기 때문이다.

```
Math.random().toString(36) // 36 string
Math.random().toString(36).substring(2)
```

- js에서 랜덤 코드는 어떻게 생성할까? uuid나 위의 코드를 이용한다.

```
npm install uuid
```

- npm install uuid (vscode 터미널)
- https://www.npmjs.com/package/uuid (uuid npm 검색)

```
import { v4 as uuidv4 } from 'uuid';
    this.code = uuidv4().replace(/-/g, '');
```

- verification.entity.ts에 위 코드를 입력해준다.

```
mutation {
	createAccount(input:{
    email:"new@abc.com",
    password: "12345",
    role: Client
  }) {
    ok
    error
  }
}
```

- localhost:3000/graphql로 테스트해본다.
- pgAdmin4에서는 verified가 false로 나오고 verification table이 정상적으로 나오는 것을 확인할 수 있다.

```
    if (email) {
      // user email이 변경되면
      user.email = email;
      user.verified = false;
      // verification 생성
      // user를 create하고 save하고 있음
      await this.verifications.save(this.verifications.create({ user }));
    }
```

- users.service.ts에서 editProfile에 user.verified를 false로 설정해준다.
- verification이 삭제되지 않기 때문에 email verify를 시작한다.

# #6.2

- 계획은 veriofication code를 사용해 그들의 verification을 찾고, 찾은 것을 지우고 난 후, user를 verify한다.

```
@ObjectType()
export class VerifyEmailOutput extends CoreOutput {}

@InputType()
// PickType get code
export class VerifyEmailInput extends PickType(Verification, ['code']) {}

```

- users폴더 dtos폴더에 verify-email.dto.ts파일을 만들고, 위와 같이 작성해준다.

```
 //  @UseGuards(AuthGaurd) 인증 여부는 없어도 될 것 같음
  @Mutation((returns) => VerifyEmailOutput)
  // 또는 VerifyEmailInput 대신 {code}, VerifyEmailInput.code 대신 code를 넣어도 된다.
  verifyEmail(@Args('input') { code }: VerifyEmailInput) {
    this.usersService.verifyEmail(code);
  }
```

- users.resolver.ts에는 위와 같이 작성해준다.
- localhost:3000/graphql DOCS에서 verifyEmail, input에 code까지 확인할 수 있다.

```
mutation {
  verifyEmail(input: {
    code: "verification 테이블 code 값"
  }) {
    ok
    error
  }
}

```

- localhost:3000/graphql에 pgAdmin4에서 verification 테이블에서 code값을 입력해준다. 다음과 같이 전송한다.

```
  async verifyEmail(code: string): Promise<boolean> {
    // verification을 찾는다.

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
      this.users.save(verification.user);
    }
    return false;
  }
```

- users.service.ts에서 다음과 같이 작성해준다.
- pgAdmin4에서 ture로 출력된다.

# #6.3

- email에 hash가 있고, password에도 verify하면 hash된 것을 또 hash하고 있다.
- 로그인하면 false가 나오고, verify하면 hash도 같이 바뀌는 문제점이 발생한다.
- password가 account 내에서 잠겨버린 것이다.

```
      this.users.save(verification.user);
```

- users.service.ts에서 User 정보를 업데이트하는 save()를 한 번 더 호출했기 때문이다.

- users.entity.ts에서 User는 BefireUpdate()가 있는데 password를 가져와서 암호화해버린다. 그래서 암호화된 게 또 암호화된다.

```
      console.log(verification.user);

```

- users.service.ts에서 console로 찍으면 password가 나오는 것을 확인할 수 있다.

```

  @Column({ select: false })
  @Field((type) => String)
  password: string;

```

- first step
- users.entity.ts에서 select를 넣으면, password는 User에 더 이상 포함되지 않는다.
- 새로운 password를 제외한 object가 있고, save()로 전달하면 typeORM은 password가 변경되지 않았다고 생각한다. 즉, 새로운 password를 추가하지 않는다.

```
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
        // 패스워드를 못생기게 바꾼다.
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }
```

- secound step
- users.entity.ts에 hashPassword()에서 password가 있을 경우만 password를 hash하도록 한다.
- BeforeInsert, BeforeUpdate 할 때, password가 들어가 있으면 password를 hash하도록 한다.

```
  if (password) {
      user.password = password;
    }
    return this.users.save(user);
```

```
      this.users.save(verification.user);
```

- users.save()로 전달된 object에 password가 있으면 password를 hash하도록 한다.
- password를 가지고 있지 않으면 this.users.save(user)에는 user에는 password가 담겨있을 것이고, 담기게 된다.
- password를 가지고 있으면 BeforeUpdate(), hashPassword()가 실행된다.

```
    const verification = await this.verifications.findOne(
      { code },
      { relations: ['user'] },
    );
```

```
  @Column({ select: false })
  @Field((type) => String)
  password: string;
```

```
      this.users.save(verification.user);
```

```
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
```

- users.service.ts에서 user를 불러오고, users.entity.ts에서 password는 select 하지 않게 했다.
- users.service.ts에서는 user를 users.save()를 호출하면 user에는 password가 담기지 않을 것이고, TypeORM에는 담기지 않고, users.entity.ts에서 try/catch부분을 실행하지 않게 된다.
- object에 password가 없기 때문이다.

```
  // one-to-one relations
  // "CASCADE"는 user를 삭제하면 user와 verification도 삭제됨
  // "SET NULL"은 null인 verification도 존재하게 함
  @OneToOne((type) => User, { onDelete: 'CASCADE' }) //
  @JoinColumn()
  user: User;
```

- verification.entity.ts에서 위와 같이 입력해준다.

```
DELETE FROM public."user"
	WHERE ID=number;
```

- user의 id를 삭제해주고 계정을 다시 만들어준다.

```
mutation {
	createAccount(input:{
    email:"new@abc.com",
    password: "12345",
    role: Client
  }) {
    ok
    error
  }
}
```

- 정상적으로 계정생성됨

```
mutation {
	login(input:{
      email: "new@abc.com",
        password: "12345"
  }) {
    ok
    error
    token
  }
}
```

- data and hash arguments required entity를 변경했기 때문에 에러메시지 발생

```
  @Column({ select: false })
  @Field((type) => String)
  password: string;
```

- select가 false이다.

```
      const ok = await bcrypt.compare(aPassword, this.password);
```

- this.password가 정의되지 않았다. this.password가 selct되지 않고 있다.

```
  const user = await this.users.findOne(
        { email },
        { select: ['password'] },
      );
```

- users.service.ts findOne에게 selct하고 싶다고 전달해줘야 한다.
- null이였지만, user.checkPassword에서 this.password를 가지게 된다.
- user.id도 select해준다. 다음번에 로그인할 때 user.id도 필요로 하기 때문이다.

```
User {
  password: 'token '
}
```

```
      const token = this.jwtService.sign(user.id)
```

- token이 아무것도 없이 sign 되었다. user.id가 undefined되었다.

```
  sign(userId: number): string {
    console.log(userId);
    return jwt.sign({ id: userId }, this.options.privateKey);
  }
```

- jwt.service.ts에서 console.log()를 찍어보면 undefined되었다.

```
      const user = await this.users.findOne(
        { email },
        { select: ['id', 'password'] },
      );
```

- users.service.ts에서 id도 select해준다.

```
  async verifyEmail(code: string): Promise<boolean> {
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
        console.log(verification.user);
        this.users.save(verification.user);
      }
      throw new Error();
    } catch (e) {
      return true;
    }
  }
```

- users.service.ts에서 try/catch로 에러 핸들링 후 return true로 변경해준다.

```
 @Mutation((returns) => VerifyEmailOutput)
  // 또는 VerifyEmailInput 대신 {code}, VerifyEmailInput.code 대신 code를 넣어도 된다.
  async verifyEmail(
    @Args('input') { code }: VerifyEmailInput,
  ): Promise<VerifyEmailOutput> {
    try {
      await this.usersService.verifyEmail(code);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
```

- users.resolver.ts에도 try/catch로 에러 핸들링 후, async/await Promise를 해준다.

```
mutation {
  verifyEmail(input: {
    code: "pgadmin4에서 code값"
  }) {
    ok
    error
  }
}
```

- localhost:3000/graphql에서 출력해보면, pgAdmin4에서 hash값이 바뀌지 않는 것을 확인할 수 있다.

# #6.4

- service나 resolver를 clean code한다.
- nico github 코드 참조

```
    return this.usersService.verifyEmail(code);
```

- users.resolver.ts에서 return 해주는 이유는 비동기함수이기 때문이다. 브라우저가 auto로 function이 끝나길 기다려준다(await).

```
async
const { ok, error } = await this.~
return { ok, error}
```

- 위 코드 처럼 명시적으로 써줄수도 있다.
- resolver는 도어맨이다. input 받아서 input을 service로 전달해줌.
- service는 이들을 다루는 로직이다.
- controller도 있었는데 url 다루는 것이였다. controller는 일을 service에 주었다.

# #6.5

```
        await this.users.save(verification.user);
        // 사용자 당 하나의 인증서만 가질 수 있고, 인증서당 하나의 유저만 가질 수 있기 때문에 인증되면 verification 삭제해준다.
        await this.verifications.delete(verification.id);
```

- users.service.ts에서 위와 같이 입력해준다.

- - https://www.mailgun.com/

# #~

- 개인프로젝트 진행중 2022.02.03~

# #6.6

- 이메일 모듈을 만든다.

- https://github.com/nest-modules/mailer (nestjs email module 검색)

- https://nest-modules.github.io/mailer/ (mailer docs)
- pug도 연동되서 더 복잡한 메일을 보낼 수 있다.

```
@Module({
  imports: [
    MailerModule.forRoot({
      // 설정을 아래와 같이 하고
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      // template에서는 pug로 HTML 변수를 넣을 수 있다.
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
})
export class AppModule {}
```

- nest g mo mail (vscode 터미널)
- mail이라는 모듈을 만들어준다.
- jwt.module.ts JWT모듈을 global 빼고 mail.module.ts에 복붙해준다.

- common폴더에 common.constants.ts파일을 만들어준다.

```
export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';
```

- jwt.constants.ts파일에 있던 위의 내용을 복붙해서 jwt.constants.ts파일 내용은 삭제해주고, common.constants.ts에 넣어준다.
- 이제는 아무곳(전역)에서나 CONFIG_OPTIONS을 사용할 수 있다.

```
export interface MailModuleOptions {
  apiKey: string;
  domain: string;
  fromEmail: string;
}
```

- mail.interfaces.ts를 만들어준다.

```
 MAILGUN_API_KEY=""
 MAILGUN_DOMAIN=""
 MAILGUN_FROM_EMAIL=""
```

- 위의 값(value)를 각각 .env파일에 입력해준다.

```
    MailModule.forRoot({
      apiKey: process.env.MAILGUN_API_KEY,
      fromEmail: process.env.MAILGUN_FROM_EMAIL,
      domain: process.env.MAILGUN_DOMAIN,
    }),
```

- app.module.ts에서 위와 같이 설정해준다.

```
  MAILGUN_API_KEY: Joi.string().required(),
  MAILGUN_DOMAIN: Joi.string().required(),
  MAILGUN_FROM_EMAIL: Joi.string().required(),
```

- app.module.ts에서 joi로 스키마의 유효성을 검사한다.

```
@Module({})
export class MailModule {
  static forRoot(options: MailModuleOptions): DynamicModule {
    return {
      module: MailModule,
      // jwt.interfaces.ts와 같이 CONFIG_OPTIONS을 만든다.
      providers: [{ provide: CONFIG_OPTIONS, useValue: options }],
      exports: [],
    };
  }
}
```

- mail.module.ts은 위 코드와 같이 입력해준다.

# #6.7

- mail폴더에 mail.service.ts파일을 만들어준다.

```
@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {
    console.log(options);
  }
}

```

- jwt.service.ts를 복붙해서 mail.service.ts에 넣어주고, 일부는 변경해준다.

```
@Module({})
export class MailModule {
  static forRoot(options: MailModuleOptions): DynamicModule {
    return {
      module: MailModule,
      // jwt.interfaces.ts와 같이 CONFIG_OPTIONS을 만든다.
      providers: [
        { provide: CONFIG_OPTIONS, useValue: options },
        // providers MailService 추가
        MailService,
      ],
      // exports MailService 추가
      exports: [MailService],
    };
  }
}
```

- mail.module.ts에는 MailService를 추가해준다.

```
{
  apiKey: 'bla~',
  fromEmail: 'bla~',
  domain: "bla~"
}
```

- 위 코드가 콘솔 로그에 출력된다.
- 다른 프로젝트에도 사용할 수 있게 send email only처럼 할 수 있고, 프로젝트에 맞춰서 구체적으로 만들 수도 있다.
- API를 실행하기 위해 cURL을 사용한다.
- nodeJS front-end에는 fetch가 없기 때문에 패키지를 설치한다.
- https://velog.io/@delilah/Node.js-fetch-API (nodejs fetch 검색)
- fetch란 자바스크립트에서 서버로 네트워크 요청(request)을 보내고 응답(response)을 받을 수 있도록 해주는 메서드이다.
- request 패키지는 자바스크립트 생태계를 위해 중단되서 got란 것을 설치한다.
- https://github.com/request/request/issues/3142 (request 검색)
- npm i got@11.8.3 (vscode 터미널)
- npm i form-data (vscode 터미널)

```
import * as FormData from 'form-data';
```

- form_data_1.default is not a constructor 에러메시지가 나오기 때문에 \* as를 붙여준다.

- MAILGUN_DOMAIN을 ${this.options.domain}에 맞게 고쳐줘야 Mailgun Magnificent API 에러 메시지가 나오지 않는다.

```
import got from 'got';
// form_data_1.default is not a constructor -> * as
import * as FormData from 'form-data';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {
    // console.log(options);
    this.sendEmail('testing', 'test')
      .then(() => {
        console.log('Message sent');
      })
      .catch((e) => {
        console.log(e.response.body);
      });
    // 이메일을 보내는 기능 -> 인증메일을 보내는 서비스
  }

  private async sendEmail(subject: string, content: string) {
    const form = new FormData();
    form.append('from', `Excited User <mailgun@${this.options.domain}>`);
    form.append('to', `${this.options.fromEmail}`);
    form.append('subject', subject);
    form.append('text', content);
    const response = await got(
      `https://api.mailgun.net/v3/${this.options.domain}/messages`,
      {
        method: 'POST',
        headers: {
          // node > Buffer.from(`api:YOUR_API_KEY`).toString(`base64`)
          // Buffer는 Node.js 에서 제공하는 Binary의 데이터를 담을 수 있는 객체
          Authorization: `Basic ${Buffer.from(
            `api:${this.options.apiKey}`,
          ).toString('base64')}`,
        },
        body: form,
      },
    );
    console.log(response.body);
  }
}
```

- mail.service.ts에는 위와 같이 된다.
- https://sangwook.github.io/2014/07/06/farewell-node-js-tj-holowaychuk.html (TJ Holowaychuk 검색)

# #6.8

```
{{username}} 님의 회원가입이 완료되었습니다.
a href="http://127.0.0.1:3000/confirm?code={{code}}"
```

- 위의 코드를 추가해주며 mailgun에서 템플릿 만들어준다.

```
  private async sendEmail(subject: string, template: string) {
    const form = new FormData();
    form.append('from', `Excited User <mailgun@${this.options.domain}>`);
    form.append('to', `${this.options.fromEmail}`);
    form.append('subject', subject);
    form.append('template', template);
    form.append('v:code', 'sdfsf');
    form.append('v:username', 'won');
```

- mail.service.ts에서 template, v:code, v:username 추가해준다.

# #6.9

```

export interface EmailVar {
  key: string;
  value: string;
}

```

- mail.interfaces.ts에서 EmailVar를 만들어준다.

```
private async sendEmail(
    subject: string,
    template: string,
    emailVars: EmailVar[],
  ) {
    const form = new FormData();
    form.append('from', `Do Won <mailgun@${this.options.domain}>`);
    form.append('to', `${this.options.fromEmail}`);
    form.append('subject', subject);
    form.append('template', template);
    // 자바스크립트 키워드인 var 대신 emailVar를 사용한다.
    emailVars.forEach((emailVar) => form.append(emailVar.key, emailVar.value));
    try {
      await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
        method: 'POST',
        headers: {
          // node > Buffer.from(`api:YOUR_API_KEY`).toString(`base64`)
          // Buffer는 Node.js 에서 제공하는 Binary의 데이터를 담을 수 있는 객체
          Authorization: `Basic ${Buffer.from(
            `api:${this.options.apiKey}`,
          ).toString('base64')}`,
        },
        body: form,
      });
    } catch (e) {
      // Quietly fail 에러 있어도 알리지 않음
      console.log(e);
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('이메일 인증', 'verify-email', [
      { key: 'code', value: code },
      { key: 'username', value: email },
    ]);
  }
```

- mail.service.ts에서 위의 코드를 추가해준다.

```
@Global()
```

- mail.module.ts에서 sendVerificationEmail을 전역으로 쓸수있게 @Global() 추가해준다.

```
    private readonly mailService: MailService,
```

- users.service.ts에서 MailService를 추가해준다.

```
 // createAccount sendVerification 사용할 수 있게 추가
      this.mailService.sendVerificationEmail(user.email, verification.code);
```

- users.service.ts에서 createAccount에서 sendVerification를 추가해준다.

```
  // editProfile verification 과 sendVerificationEmail 추가
        const verification = await this.verifications.save(
          this.verifications.create({ user }),
        );
        this.mailService.sendVerificationEmail(user.email, verification.code);
```

- users.service.ts에서 editProfile에서 verification과 sendVerification를 추가해준다.

```
mutation {
  login(input:{
    email:"new@abc.com",
    password: "12345",
  }) {
    ok
    token
    error
  }
}
```

- localhost:3000/graphql을 통해 로그인 해주고 헤더에 x-jwt 토큰 값을 받아온다.

```
 DELETE FROM public."verification"
	WHERE ID=0~20;
```

- verification 테이블의 모든 자료를 삭제해준다. 나는 20개 이상 지운 것 같다.

```
mutation {
	editProfile(input:{
    email: "good@naver.com"
  }) {
    ok
    error
  }
}
```

- Profile에서 email을 변경해주면 mailgun을 통해 메일이 발송된다.

```
 sendVerificationEmail(email: string, code: string) {
    this.sendEmail('이메일 인증', 'signup', [
      { key: 'code', value: code },
      { key: 'username', value: email },
    ]);
  }
```

- mail.service.ts에서 verify-email을 signup으로 바꿔주지 않아서 약간 헤맸다.

```
message: "Cannot GET /confirm?code="bla~~bla~~"
```

- gmail인 경우 스팸아님으로 해야 클릭이 된다.

```
          const loginUser = await this.usersService.findById(decoded['id']);
          // console.log(user);
          // 사용자(user)에게 요청(request)한다.
          req['user'] = loginUser.user;
```

- jwt.middleware.ts에서 위 코드도 추가해줬다.

# #7.0

- users.service.ts 유닛 테스트(UT) 해본다.
- End-to-End(E2E), Integration Test(IT)도 해야한다. 그리고 resolver에 대해서도 테스트 해본다.
- npm run test:watch(vscode 터미널)
- No tests found related to files changed since last commit. 테스트할 파일이 없다고 나온다.
- users폴더에 users.service.spec.ts test파일을 만들어준다.
- Your test suite must contain at least one test. 적어도 하나의 테스트가 있어야 한다.

```
  "jest": {
    "testRegex": ".*\\.spec\\.ts$",
  }
```

- jest가 spec.ts를 찾고 있기 때문에 spec.ts파일이 필요하다.

```
import { UserService } from 'src/users/users.service';
private readonly userService: UserService,
 const loginUser = await this.userService.findById(decoded['id']);
 req['user'] = loginUser.user;
```

```
export class UserService {}
```

- jwt.middleware.ts, users.service.ts 모두 UsersService에서 UserService로 바꿔준다.

```
import { Test } from '@nestjs/testing';
import { UserService } from '../users/users.service';

describe('UserService', () => {
  let service: UserService;

  beforeAll(async () => {
    // testing module을 만든다.
    const module = await Test.createTestingModule({
      providers: [UserService],
    }).compile();
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // users.service.ts 5가지 항목을 테스트 한다.
  it.todo('createAccount');
  it.todo('login');
  it.todo('findById');
  it.todo('editProfile');
  it.todo('verifyEmail');
});

```

- users.service.spec.ts에서는 위와 같이 작성해준다.
- Cannot find module 'src/common/entities/core.entity' from 'users/entities/users.entity.ts' 모듈을 찾지 못하는 오류가 발생한다.

# #7.1

- Cannot find module 'src/common/entities/core.entity' from 'users/entities/users.entity.ts' 모듈을 찾지 못하는 오류는 jest가 코드의 경로를 찾지 못해서 발생하는 문제이다.

```
// jest는 CoreEntity 경로와 같은 형식은 되지 않는다.
import { CoreEntity } from 'src/common/entities/core.entity';
```

- users.entity.ts에서 위와 같은 형식은 안된다.

```
 "jest": {
    "moduleNameMapper": {
      "^src/(.*)$": "<rootDir>/$1"
    },
        "rootDir": "src",
```

- jest에서 src로 시작하는 게 있으면 rootDir를 찾게되고 rootDir은 src이다.

```
import { UserService } from './users.service';
  constructor(private readonly usersService: UserService) {}
```

- users.resolver.ts usersService에서 userService로 바꾼다.

```
  providers: [UsersResolver, UserService],
  exports: [UserService],
```

- users.module.ts도 마찬가지로 usersService에서 userService로 바꾼다.

- Error: Config validation error: "DB_HOST" is required. "DB_PORT" is required. "DB_USERNAME" is required.
  "DB_PASSWORD" is required. "DB_NAME" is required. "PRIVATE_KEY" is required. "MAILGUN_API_KEY" is required. "MAILGUN_DOMAIN" is required. "MAILGUN_FROM_EMAIL" is required 요딴 에러메시지로 시작하는 나는 yarn start로 실행시킨 나다. yarn start:dev나 npm run test:watch로 실행시켜라.

```
// mockRepository는 가짜 레파지토리이다.
const mockRepository = {
  // fn()는 가짜 function이다.
  // users.service.ts에는 findOne, save, create가 있다.
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
};
const mockJwtService = {
  // jwt.service.ts에는 sign, verify가 있다.
  sign: jest.fn(),
  verify: jest.fn(),
};
// Nest can't resolve dependencies of the UserService (UserRepository, VerificationRepository, JwtService, ?). Please make sure that the argument MailService at index [3] is available in the RootTestModule context.
const mockMailService = {
  // mail.service.ts에는 sendVerificationEmail가 있다.
  sendVerificationEmail: jest.fn(),
};
describe('UserService', () => {
  let service: UserService;

  beforeAll(async () => {
    // testing module을 만든다.
    const module = await Test.createTestingModule({
      providers: [
        // 진짜 userService를 호출함. 아래는 가짜 Mock임.
        UserService,
        // users.service에서 진짜 (User) Repository를 불러오는 것이 아니라, Mock Repository를 제공함
        // Mock은 UserService만 단독으로 테스트 하기 위해 가짜 function, class 실행
        // useValue는 가짜 값이다.
        // TypeOrm에게 거짓말한다.
        { provide: getRepositoryToken(User), useValue: mockRepository },
        // Nest can't resolve dependencies of the UserService (UserRepository, ?, JwtService, MailService). Please make sure that the argument VerificationRepository at index [1] is available in the RootTestModule context.
        { provide: getRepositoryToken(Verification), useValue: mockRepository },
        // Nest can't resolve dependencies of the UserService (UserRepository, VerificationRepository, ?, MailService). Please make sure that the argument JwtService at index [2] is available in the RootTestModule context.
        { provide: JwtService, useValue: mockJwtService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // users.service.ts 5가지 항목을 테스트 한다.
  it.todo('createAccount');
  it.todo('login');
  it.todo('findById');
  it.todo('editProfile');
  it.todo('verifyEmail');
});
```

- users.service.spec.ts에서 위와 같이 해준다.
- mockRepository는 가짜 레파지토리이다.
- fn()는 가짜 function이다.
- users.service.ts에는 findOne, save, create가 있다.
- jwt.service.ts에는 sign, verify가 있다.
- mail.service.ts에는 sendVerificationEmail가 있다.
- 진짜 userService를 호출함. 아래는 가짜 Mock임.
- users.service에서 진짜 (User) Repository를 불러오는 것이 아니라, Mock Repository를 제공함
- Mock은 UserService만 단독으로 테스트 하기 위해 가짜 function, class 실행
- useValue는 가짜 값이다.
- TypeOrm에게 거짓말한다.
- 다음으로는 createAccount를 테스트해준다.
- 갑자기 'module name'에 대한 선언 파일을 찾을 수 없습니다. 라는 메시지의 에러가 뜨는 문제가 발생했다.
```
    "typeRoots": ["./@types", "./node_modules/@types"]
```
- 위 코드 추가해줌
- https://velog.io/@hyunjoong/%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EB%AA%A8%EB%93%88-%EC%97%90-%EB%8C%80%ED%95%9C-%EC%84%A0%EC%96%B8-%ED%8C%8C%EC%9D%BC%EC%9D%84-%EC%B0%BE%EC%9D%84-%EC%88%98-%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4 (타입스크립트 해당 형식 선언을 찾을수 없습니다 검색)
