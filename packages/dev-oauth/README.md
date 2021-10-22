# @sl-nest-module/dev-oauth

Shopline [developer-center](https://shopline-developers.readme.io/docs/get-started) oauth module for [NestJS](https://docs.nestjs.com/) project

## Installation

```sh
yarn add @sl-nest-module/dev-oauth
```

## Usage

### Registering Module

`DeveloperOAuthModule` provided 2 methods to register: `forRoot` and `forRootAsync`

```ts
import { DeveloperOAuthModule } from '@sl-nest-module/dev-oauth';

// Example 1: forRoot

@Module({
  imports: [
    /* Other Modules */
    DeveloperOAuthModule.forRoot({
      host: process.env.DEVELOPER_OAUTH_HOST,
      appId: process.env.DEVELOPER_APP_ID,
      appSecret: process.env.DEVELOPER_APP_SECRET,
    })
  ]
})
export class RootModule {}

// Example 2: forRootAsync

@Module({
  imports: [
    /* Other Modules */
    DeveloperOAuthModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          host: config.developerApp.host,
          appId: config.developerApp.id,
          appSecret: config.developerApp.secret,
        };
      },
      inject: [ConfigService],
    })
  ]
})
export class RootModule {}
```
---
### Using auth gurad and decorators

```ts
import { DeveloperOAuthJwtAuthGuard, User } from '@sl-nest-module/dev-oauth';
import { Controller, Post, UseGuards } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  @Post()
  @UseGuards(DeveloperOAuthJwtAuthGuard)
  async createTask(@User('merchantId') merchantId: string) {
    /*
      Do complex logic
    */
  }
}
```