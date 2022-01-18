# @sl-nest-module/aws-lambda

[AWS Lambda](https://aws.amazon.com/lambda/) module for [NestJS](https://docs.nestjs.com/) project

## Installation

```sh
yarn add @sl-nest-module/aws-lambda
```

## Usage

### Initialization

The AWS region and credentials are used to initialize the [@aws-sdk/lambda-client](https://www.npmjs.com/package/@aws-sdk/client-lambda) SDK and are optional in module initialization. If not provided, the AWS SDK will read the region and credentials from several other sources, such as the environment values `AWS_REGION` or the shared credentials file `~/.aws/credentials`.

For different ways to provide the AWS region, see [here](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-region.html).

For different ways to provide the AWS credentials, see [here](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html).

#### Example using sync initialization `AwsLambdaModule.register`

```typescript
// foo.module.ts

import { Module } from '@nestjs/common';
import { AwsLambdaModule } from '@sl-nest-module/aws-lambda';
import { fromWebToken } from '@aws-sdk/credential-providers';

@Module({
  imports: [
    AwsLambdaModule.register({
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

#### Example using async initialization `AwsLambdaModule.registerAsync`

```typescript
// foo.module.ts

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsLambdaModule } from '@sl-nest-module/aws-lambda';
import { fromWebToken } from '@aws-sdk/credential-providers';

@Module({
  imports: [
    AwsLambdaModule.registerAsync({
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

### Invoking AWS Lambda function

```typescript
// foo.service.ts

import { Injectable } from '@nestjs/common';
import { AwsLambdaService, constructLambdaArn, objectToPayload, payloadToObject } from '@sl-nest-module/aws-lambda';

@Injectable()
export class FooService {
  constructor(private readonly awsLambdaService: AwsLambdaService) {}

  async bar() {
    try {
      const functionArn = constructLambdaArn({
        region: 'ap-southeast-1',
        accountId: '000000000',
        functionName: 'say-hello',
      });
      const payload = objectToPayload({ name: 'Peter' });
      const response = await this.awsLambdaService.invoke(functionArn, payload);
      const parsedResponse = payloadToObject(response) as { message: string };
      console.log(parsedResponse.message); // Output: Hello Peter!
    } catch (error) {
      if (error instanceof AwsLambdaFunctionError || error instanceof AwsLambdaResponseError) {
        console.error('Encountered error with AWS Lambda:', error.message);
      }
      throw error;
    }
  }
}
```
