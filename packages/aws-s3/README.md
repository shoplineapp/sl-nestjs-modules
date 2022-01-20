# @sl-nest-module/aws-lambda

[AWS S3](https://aws.amazon.com/s3/) module for [NestJS](https://docs.nestjs.com/) project

## Installation

```sh
yarn add @sl-nest-module/aws-s3
```

## Usage

### Initialization

The AWS region and credentials are used to initialize the [@aws-sdk/s3-client](https://www.npmjs.com/package/@aws-sdk/client-s3) SDK and are optional in module initialization. If not provided, the AWS SDK will read the region and credentials from several other sources, such as the environment values `AWS_REGION` or the shared credentials file `~/.aws/credentials`.

For different ways to provide the AWS region, see [here](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-region.html).

For different ways to provide the AWS credentials, see [here](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html).

#### Example using sync initialization `AwsS3Module.register`

```typescript
// foo.module.ts

import { Module } from '@nestjs/common';
import { AwsS3Module } from '@sl-nest-module/aws-s3';
import { fromWebToken } from '@aws-sdk/credential-providers';

@Module({
  imports: [
    AwsS3Module.register({
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

#### Example using async initialization `AwsS3Module.registerAsync`

```typescript
// foo.module.ts

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsS3Module } from '@sl-nest-module/aws-lambda';
import { fromWebToken } from '@aws-sdk/credential-providers';

@Module({
  imports: [
    AwsS3Module.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        region: configService.get('AWS_REGION'),
        credentials: fromWebToken({
          roleArn: configService.get('AWS_ROLE_ARN'),
          webIdentityToken: configService.get('AWS_WEB_IDENTITY_TOKEN'),
        }),
      }),
    }),
  ],
  providers: [FooService],
})
export class FooModule {}
```

### Get Object from S3

```typescript
// foo.service.ts

import { Injectable } from '@nestjs/common';
import { AwsS3Service } from '@sl-nest-module/aws-s3';

@Injectable()
export class FooService {
  constructor(private readonly awsS3Service: AwsS3Service) {}

  async bar() {
    const response = await this.AwsS3Service.getObject('<bucket-name>', '<object-key>');
    return response.data;
  }
}
```
