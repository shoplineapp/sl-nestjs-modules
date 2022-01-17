import { DynamicModule, Module } from '@nestjs/common';
import { LambdaClient } from '@aws-sdk/client-lambda';
import { AwsLambdaService } from './aws-lambda.service';
import { AwsLambdaAsyncOptions, AwsLambdaOptions } from './aws-lambda.interface';
import { AWS_LAMBDA_OPTIONS } from './aws-lambda.constants';

/**
 * [AWS Lambda](https://aws.amazon.com/lambda/) module that interface with [@aws-sdk/client-lambda](https://www.npmjs.com/package/@aws-sdk/client-lambda) behind the scene
 */
@Module({})
export class AwsLambdaModule {
  /**
   * Initialize the module
   * @param options Configuration option
   * @returns A dynamic `AwsLambdaModule`
   */
  static register(options: AwsLambdaOptions): DynamicModule {
    return {
      module: AwsLambdaModule,
      providers: [
        {
          provide: LambdaClient,
          useValue: new LambdaClient(options),
        },
        AwsLambdaService,
      ],
      exports: [AwsLambdaService],
    };
  }

  /**
   * Initialize the module
   * @param asyncOptions Async Configuration option
   * @returns A dynamic `AwsLambdaModule`
   */
  static registerAsync({ inject, useFactory }: AwsLambdaAsyncOptions): DynamicModule {
    return {
      module: AwsLambdaModule,
      providers: [
        { provide: AWS_LAMBDA_OPTIONS, inject, useFactory },
        {
          provide: LambdaClient,
          inject: [AWS_LAMBDA_OPTIONS],
          useFactory: (options) => new LambdaClient(options),
        },
        AwsLambdaService,
      ],
      exports: [AwsLambdaService],
    };
  }
}
