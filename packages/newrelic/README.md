# @sl-nest-module/newrelic

[newrelic](https://newrelic.com) module for [NestJS](https://docs.nestjs.com/) project

## Installation

```sh
yarn add @sl-nest-module/newrelic
```

## Usage

### Setup newrelic
- `import 'newrelic'` as the first line of your app's main module, usually in `main.ts` file. Please refer to the [official documentation](https://docs.newrelic.com/docs/apm/agents/nodejs-agent/installation-configuration/install-nodejs-agent) for more detailed information.

- Setup the `newrelic.ts` file in `/src`. Please refer to this [official integration guide](https://newrelic.com/blog/how-to-relic/new-relic-nestjs) for more information.


### Registering module
Import `NewrelicModule` into the root `AppModule` and use the `register()` method to configure it. This method accepts an optional `NewrelicOptions`.

`NewrelicOptions`

| Parameter  | Description                                                                               |
| ---------- | ----------------------------------------------------------------------------------------- |
| global    | Config if newrelic module is register as global module. Default is true.                                |

### Send web transaction to newrelic
Config `NewrelicInterceptor` as [global interceptor](https://docs.nestjs.com/interceptors#binding-interceptors) and it will send all web transaction to newrelic using [startWebTransaction](https://docs.newrelic.com/docs/apm/agents/nodejs-agent/api-guides/nodejs-agent-api#startWebTransaction) method.

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { NewrelicModule, NewrelicInterceptor } from '@sl-nest-module/newrelic';

@Module({
  imports: [
    NewrelicModule.register({
      // options
    }),
  ],
  providers: [
     {
      provide: APP_INTERCEPTOR,
      useClass: NewrelicInterceptor,
    },
  ],
})
export class AppModule {}
```

### Send background transaction to newrelic
Add `StartBackgroundTransaction` decorator to your background job (queue-job, cron-job, etc.) and it will send transaction to newrelic using [startBackgroundTransaction](https://docs.newrelic.com/docs/apm/agents/nodejs-agent/api-guides/nodejs-agent-api#startBackgroundTransaction) method.

`StartBackgroundTransaction` accept handlerName as argument. The handlerName defines the transaction name and needs to be static. Do not include variable data such as user ID.

```typescript
// my-cron-job.ts
import { StartBackgroundTransaction } from '@sl-nest-module/newrelic';

export class MyCronJob {

  @StartBackgroundTransaction('my-cron-job')
  async function handler(){
    // job logic
  }

}

```
