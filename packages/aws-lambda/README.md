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

```typescript
// foo.module.ts

import { Module } from '@nestjs/common';
import { AwsLambdaModule } from '@sl-nest-module/aws-lambda';

@Module({
  imports: [
    AwsLambdaModule.register({
      region: configService.aws.region,
      credentials: fromWebToken({
        roleArn: 'ap-southeast-1',
        webIdentityToken: '<web-identity-token>',
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

@Injectable()
export class FooService {
  constructor(private readonly awsLambdaService: AwsLambdaService) {}

  async bar() {
    try {
      const functionName = 'arn:aws:lambda:ap-southeast-1:000000000000:function:say-hello';
      const payload = Buffer.from(JSON.stringify({ name: 'Peter' }));
      const response = await this.awsLambdaService.invoke(functionName, payload); // Replace with your function name and payload
      const parsedResponse = Buffer.from(response).toString();
      console.log(parsedResponse); // Output: Hello Peter!
    } catch (error) {
      if (error instanceof AwsLambdaFunctionError || error instanceof AwsLambdaResponseError) {
        console.error('Encountered error with AWS Lambda:', error.message);
      }
      throw error;
    }
  }
}
```
