# @sl-nest-module/aws-sqs

[AWS SQS](https://aws.amazon.com/sqs/) module for [NestJS](https://docs.nestjs.com/) project

## Installation

```sh
yarn add @sl-nest-module/aws-sqs
```

## Usage

### Registering Module

The AWS `region`, `roleArn`, and `webIdentityToken` are used to initialize the SQS client

```typescript
// foo.module.ts

import { Module } from '@nestjs/common';
import { AwsSQSModule } from '@sl-nest-module/aws-sqs';

@Module({
  imports: [
    AwsSQSModule.register({
      region: 'ap-southeast-1',
      roleArn: 'arn:aws:iam::000000000000:role/XXXXX',
      webIdentityToken: '<web-identity-token>',
    }),
  ],
  providers: [FooService],
})
export class FooModule {}
```

### Registering Module Async

```typescript
// foo.module.ts

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsSQSModule } from '@sl-nest-module/aws-sqs';

@Module({
  imports: [
    AwsSQSModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        region: config.region,
        roleArn: config.roleArn,
        webIdentityToken: config.webIdentityToken,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [FooService],
})
export class FooModule {}
```

### Sending Message to AWS SQS

```typescript
// foo.service.ts

import { Injectable } from '@nestjs/common';
import { AwsSQSService } from '@sl-nest-module/aws-sqs';

@Injectable()
export class FooService {
  constructor(private readonly awsSQSService: AwsSQSService) {}

  async sendMessage() {
    try {
      const queueUrl = '<queueUrl>';
      const messageBody = '<message body>';
      await this.awsSQSService.sendMessage(queueUrl, messageBody);
    } catch (error) {
      // Handle error
    }
  }
}
```
