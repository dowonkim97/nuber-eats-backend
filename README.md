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
