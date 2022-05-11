# @sl-nest-module/aws-ses

[AWS SES](https://aws.amazon.com/ses/) module for [NestJS](https://docs.nestjs.com/) project

## Installation

```sh
yarn add @sl-nest-module/aws-ses
```

## Usage

### Registering Module

The AWS region and credentials are used to initialize the SES client SDK. If not provided, the default setting will be used.

For setting of the AWS region, see [here](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-region.html).

For setting of the AWS credentials, see [here](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html).

```typescript
// foo.module.ts

import { Module } from '@nestjs/common';
import { AwsSESModule } from '@sl-nest-module/aws-ses';
import { fromWebToken } from '@aws-sdk/credential-providers';

@Module({
  imports: [
    AwsSESModule.register({
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
import { AwsSESModule } from '@sl-nest-module/aws-ses';
import { fromWebToken } from '@aws-sdk/credential-providers';

@Module({
  imports: [
    AwsSESModule.registerAsync({
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

### Sending Email through AWS SES

`AwsSESService.sendEmail`

| Parameter   | Description                                                                                                                                                                   |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| sender      | The email address that is sending the email. This email address must be either individually verified with Amazon SES, or from a domain that has been verified with Amazon SES |
| toAddresses | The destination email addresses for the email                                                                                                                                 |
| subject     | The subject of the email                                                                                                                                                      |
| body        | The HTML body of the email                                                                                                                                                    |

For more information, see [here](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ses/interfaces/sendemailcommandinput.html).

```typescript
// foo.service.ts

import { Injectable } from '@nestjs/common';
import { AwsSESService } from '@sl-nest-module/aws-ses';

@Injectable()
export class FooService {
  constructor(private readonly awsSESService: AwsSESService) {}

  async sendEmail() {
    try {
      const sender = '<email address of sender>';
      const toAddresses = ['<email address of receivers>'];
      const subject = '<email subject>';
      const body = '<email body>';
      await this.awsSESService.sendEmail(sender, toAddresses, subject, body);
    } catch (error) {
      // Handle error
    }
  }
}
```
