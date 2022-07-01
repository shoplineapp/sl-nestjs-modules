# @sl-nestjs-modules/aws-sqs

[AWS SQS](https://aws.amazon.com/sqs/) module for [NestJS](https://docs.nestjs.com/) project

## Installation

```sh
yarn add @sl-nestjs-modules/aws-sqs
```

## Usage

### Registering Module

The AWS region and credentials are used to initialize the SQS client SDK. If not provided, the default setting will be used.

For setting of the AWS region, see [here](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-region.html).

For setting of the AWS credentials, see [here](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html).

```typescript
// foo.module.ts

import { Module } from '@nestjs/common';
import { AwsSQSModule } from '@sl-nestjs-modules/aws-sqs';
import { fromWebToken } from '@aws-sdk/credential-providers';

@Module({
  imports: [
    AwsSQSModule.register({
      region: 'ap-southeast-1',
      credentials: fromWebToken({
        roleArn: 'arn:aws:iam::000000000000:role/XXXXX',
        webIdentityToken: '<web-identity-token>',
      }),
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
import { AwsSQSModule } from '@sl-nestjs-modules/aws-sqs';
import { fromWebToken } from '@aws-sdk/credential-providers';

@Module({
  imports: [
    AwsSQSModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        region: config.region,
        credentials: fromWebToken({
          roleArn: config.roleArn,
          webIdentityToken: config.webIdentityToken,
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [FooService],
})
export class FooModule {}
```

### Sending Message to AWS SQS

`AwsSQSService.sendMessage`

| Parameter   | Description                                                                                                                                     |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| queueUrl    | The URL of the Amazon SQS queue to which a message is sent. Queue URLs and names are case-sensitive.                                            |
| messageBody | The message to send. The minimum size is one character. The maximum size is 256 KB. A message can include only XML, JSON, and unformatted text. |

For more information, see [here](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sqs/interfaces/sendmessagecommandinput.html).

```typescript
// foo.service.ts

import { Injectable } from '@nestjs/common';
import { AwsSQSService } from '@sl-nestjs-modules/aws-sqs';

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
