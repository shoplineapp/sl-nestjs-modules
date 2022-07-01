# @sl-nestjs-modules/newrelic

[newrelic](https://newrelic.com) module for [NestJS](https://docs.nestjs.com/) project

## Installation

```sh
yarn add @sl-nestjs-modules/newrelic
```

## Usage

### Setup newrelic agent and configuration
- For containerized applications, please refer to [Install the Node.js agent for Docker](https://docs.newrelic.com/docs/apm/agents/nodejs-agent/installation-configuration/install-nodejs-agent-docker) guide. Otherwise, Please refer to [Install the Node.js agent](https://docs.newrelic.com/docs/apm/agents/nodejs-agent/installation-configuration/install-nodejs-agent) guide.

- `import 'newrelic'` as the first line of your app's main module, usually in `main.ts` file. Please follow the [official nest integration guide](https://newrelic.com/blog/how-to-relic/new-relic-nestjs) for more detailed information.

- Setup [newrelic configuration](https://docs.newrelic.com/docs/apm/agents/nodejs-agent/installation-configuration/nodejs-agent-configuration) by editing your newrelic.ts config file or by setting an environment variable.

### Registering module
Import `NewrelicModule` into the root `AppModule` and use the `register()` method to configure it. This method accepts an optional `NewrelicOptions`.

`NewrelicOptions`

| Parameter  | Description                                                                               |
| ---------- | ----------------------------------------------------------------------------------------- |
| global    | Config if newrelic module is register as global module. Default is true.                                |

### Send web transaction to newrelic
Config `NewrelicInterceptor` as [global interceptor](https://docs.nestjs.com/interceptors#binding-interceptors). This interceptor will send web transactions to newrelic using [startWebTransaction](https://docs.newrelic.com/docs/apm/agents/nodejs-agent/api-guides/nodejs-agent-api#startWebTransaction) method, and send errors to newrelic by calling [noticeError](https://docs.newrelic.com/docs/apm/agents/nodejs-agent/api-guides/nodejs-agent-api#noticeError) if error occurs.

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { NewrelicModule, NewrelicInterceptor } from '@sl-nestjs-modules/newrelic';

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
import { StartBackgroundTransaction } from '@sl-nestjs-modules/newrelic';

export class MyCronJob {

  @StartBackgroundTransaction('my-cron-job')
  async function handler(){
    // job logic
  }

}

```

### Calling newrelic APIs
You can call [newrelic agent API](https://docs.newrelic.com/docs/apm/agents/nodejs-agent/api-guides/nodejs-agent-api#noticeError) by injecting newrelic agent into your services.

For example, you may call [addCustomAttributes](https://docs.newrelic.com/docs/apm/agents/nodejs-agent/api-guides/nodejs-agent-api#add-custom-attributes) to set multiple custom attribute values to appear in the transaction trace detail view.

```typescript
import { Inject, Injectable } from '@nestjs/common';
import { NEWRELIC } from '@sl-nestjs-modules/newrelic';

@Injectable()
export class MyService {
  constructor(@Inject(NEWRELIC) private newrelicAgent) {}

  async doSomething(arg1, arg2, ...args) {
    try {
      this.newrelicAgent.addCustomAttributes({
        myCustomAttribute1: arg1,
        myCustomAttribute2: arg2,
      });
      // your function logic
      return 'success';
    } catch (error) {
      this.newrelicAgent.noticeError(error, {
        myCustomAttribute1: arg1,
        myCustomAttribute2: arg2,
      });
    }
  }
}
```

## For local development
You may set `NEW_RELIC_ENABLED` to `false` in local development to stop the newrelic agent from starting up.

```json
// package.json
{
 "scripts": {
    "start": "nest start",
    "start:dev": "NEW_RELIC_ENABLED=false nest start --watch",
  }
}
```

## For testing
You may manual mock this module by copying `__mocks__` directory to your src folder. By doing so, newrelic agent will not be imported when running unit test. For advanced mocking, please refer to [Jest mocking guide](https://jestjs.io/docs/manual-mocks#mocking-node-modules).