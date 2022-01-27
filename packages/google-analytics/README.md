# @sl-nest-module/google-analytics

[Google Analytics 4](https://developers.google.com/analytics/devguides/collection/protocol/ga4) module for [NestJS](https://docs.nestjs.com/) project

## Installation

```sh
yarn add @sl-nest-module/google-analytics
```

## Google Analytics Parameters

Measurement ID and API secret are two necessary components for the module. The following will walk you through how to create or retrieve both of them.

### Create Measurement

1. Open google analytics web application [Google Analytics 4](https://analytics.google.com/) and login to the GA account

2. Open admin setting in the left bottom of the menu

3. Select 'Data Streams' > Click 'Add stream' and select 'Web'
   ![step 3](https://github.com/shoplineapp/sl-nestjs-modules/blob/feature/HKIN-323-google-analytics/packages/google-analytics/assets/measurement-3.png)

4. Fill in the field and create stream

### Get Measurement

Web stream details > MEASUREMENT ID

### Get API secret

Measurement Protocol API secret > Create
![create secret](https://github.com/shoplineapp/sl-nestjs-modules/blob/feature/HKIN-323-google-analytics/packages/google-analytics/assets/create-secret.png)

## Usage

Measurement ID and API secret are mandatory inputs passed to the module static register method during reigstration.

#### Example using sync initialization `GoogleAnalyticsServiceModule.register`

```typescript
// foo.module.ts

import { Module } from '@nestjs/common';
import { GoogleAnalyticsModule } from '@sl-nest-module/google-analytics';

@Module({
  imports: [
    GoogleAnalyticsModule.register({
      id: 'G-XXXXXXXXXX',
      secret: '9xxxxxxxxxxxxxxxxxxxxx',
    }),
  ],
  providers: [FooService],
})
export class FooModule {}
```

Users are advised to implement their own `ConfigService`. Insofar as the API offers `.ga.id` and `.ga.secret`, which read Google Analytics measurement ID and API secret from configuration file, the following example will suffice.

#### Example using async initialization `GoogleAnalyticsServiceModule.registerAsync`

```typescript
// foo.module.ts

import { Module } from '@nestjs/common';
import { ConfigService } from '~config/config.service';
import { GoogleAnalyticsModule } from '@sl-nest-module/google-analytics';

@Module({
  imports: [
    GoogleAnalyticsModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        id: config.ga.id,
        secret: config.ga.secret,
      }),
    }),
  ],
  providers: [FooService],
})
export class FooModule {}
```

Client ID, event name are necessary parameters to the function. The event payload, on the other hand, is optional and can be passed with an empty object.

#### Invoking Google Analytics function

`logEvent`

```typescript
// foo.service.ts

import { Injectable } from '@nestjs/common';
import { GoogleAnalyticsService } from '@sl-nest-module/google-analytics';

@Injectable()
export class FooService {
  constructor(private readonly gaService: GoogleAnalyticsService) {}

  async bar() {
    try {
      const eventName: string = 'event_name';

      const field1 = 'field1';
      const field2 = 'field2';

      const eventPayload = {
        data1: field1,
        data2: field2,
      };

      const clientID: string = '2678188960.1638459419';

      await this.gaService.logEvent(clientId, eventName, eventPayload);
    } catch (error) {
      throw error;
    }
  }
}
```

## Validate Result

Select the current project in top left by 'Analytics Accounts' > 'properties & Apps'

After sending the event, the event should be shown in 'Realtime' > 'Event count by Event name'
![check event](https://github.com/shoplineapp/sl-nestjs-modules/blob/feature/HKIN-323-google-analytics/packages/google-analytics/assets/check-event.png)
