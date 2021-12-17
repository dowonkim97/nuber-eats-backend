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

# #1

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
