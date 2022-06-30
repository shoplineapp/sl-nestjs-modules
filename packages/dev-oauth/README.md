# @sl-nestjs-modules/dev-oauth

[Shopline Developer Center OAuth](https://shopline-developers.readme.io/docs/get-started) module for [NestJS](https://docs.nestjs.com/) project

## Installation

```sh
yarn add @sl-nestjs-modules/dev-oauth
```

## Usage

### Registering Module

`DeveloperOAuthModule` provided 2 methods to register: `forRoot` and `forRootAsync`

The `DeveloperOAuthOptions` are used to initialize the jwt auth guard and get token interceptor

| Parameter  | Description                                                                                   |
| ---------- | --------------------------------------------------------------------------------------------- |
| host       | The developer center host for checking and refreshing the token                               |
| scope      | The scope of the refresh token request                                                        |
| appId      | The client id of the refresh token request                                                    |
| appSecret  | The client secret of the refresh token request, and the secret for validating jwt token       |
| tokenStore | The `DeveloperOAuthTokenStore` interface, should be provided when using get token interceptor |

`DeveloperOAuthTokenStore`

| Parameter  | Description                                                                       |
| ---------- | --------------------------------------------------------------------------------- |
| readToken  | The function receives a axios request and return the token and refresh token      |
| writeToken | The function receives the axios request and store the new token and refresh token |

```ts
// root.module.ts

import { Module } from '@nestjs/common';
import { DeveloperOAuthModule } from '@sl-nestjs-modules/dev-oauth';

@Module({
  imports: [
    DeveloperOAuthModule.forRoot({
      host: process.env.DEVELOPER_CENTER_HOST,
      scope: process.env.DEVELOPER_SCOPE,
      appId: process.env.DEVELOPER_APP_ID,
      appSecret: process.env.DEVELOPER_APP_SECRET,
      tokenStore: tokenStore, // which provide the read token and write token function
    }),
  ],
})
export class RootModule {}
```

### Registering Module Async

```ts
// root.module.ts

import { Module } from '@nestjs/common';
import { DeveloperOAuthModule } from '@sl-nestjs-modules/dev-oauth';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    DeveloperOAuthModule.forRootAsync({
      useFactory: (service: UsersService) => {
        return {
          host: process.env.DEVELOPER_CENTER_HOST,
          scope: process.env.DEVELOPER_SCOPE,
          appId: process.env.DEVELOPER_APP_ID,
          appSecret: process.env.DEVELOPER_APP_SECRET,
          tokenStore: service,
        };
      },
      inject: [UsersService],
      imports: [UsersModule],
    }),
  ],
})
export class RootModule {}
```

#### Example of DeveloperOAuthTokenStore

```ts
// users.service.ts

import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService implements DeveloperOAuthTokenStore {
  constructor(private repo: UsersRepository) {}

  async readToken(request: any) {
    const merchantId = request.params.mid;
    return this.repo.findOne({ merchantId });
  }

  async writeToken(request: any, { token, refreshToken }) {
    const merchantId = request.params.mid;
    await this.repo.updateToken(merchantId, { token, refreshToken });
  }
}
```

### Using jwt auth guard

```ts
// foo.controller.ts

import { DeveloperOAuthJwtAuthGuard, User } from '@sl-nestjs-modules/dev-oauth';
import { Controller, Post, UseGuards } from '@nestjs/common';

@Controller('foo')
export class FooController {
  @Post()
  @UseGuards(DeveloperOAuthJwtAuthGuard)
  async foo(@User('merchantId') merchantId: string) {
    /*
      Do complex logic
    */
  }
}
```

### Using get token interceptor

```ts
// foo.controller.ts

import { GetTokenInterceptor } from '@sl-nestjs-modules/dev-oauth';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { Token } from './token.decorator';

@Controller('foo')
export class FooController {
  @Get()
  @UseInterceptors(GetTokenInterceptor)
  // Get token from request.token
  async foo(@Token() token: string) {
    /*
      Do complex logic
    */
  }
}
```
