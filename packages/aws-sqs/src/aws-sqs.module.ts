import { DynamicModule, Module } from '@nestjs/common';
import { AwsSQSAsyncOptions, AwsSQSOptions } from './aws-sqs.options.interface';
import { AwsSQSService } from './aws-sqs.service';
import { AWS_SQS_OPTIONS } from './constants';

/**
 * [AWS SQS](https://aws.amazon.com/sqs/) module for [NestJS](https://docs.nestjs.com/) project
 */
@Module({})
export class AwsSQSModule {
  /**
   * Initialize the module
   * @param opts Configuration option
   * @return A dynamic `AwsSQSModule`
   */
  static register(opts: AwsSQSOptions): DynamicModule {
    return {
      module: AwsSQSModule,
      providers: [
        {
          provide: AWS_SQS_OPTIONS,
          useValue: opts,
        },
        AwsSQSService,
      ],
      exports: [AwsSQSService],
    };
  }

  /**
   * Initialize the module
   * @param asyncOptions Configuration option
   * @return A dynamic `AwsSQSModule`
   */
  static registerAsync({ useFactory, inject }: AwsSQSAsyncOptions): DynamicModule {
    return {
      module: AwsSQSModule,
      providers: [
        {
          provide: AWS_SQS_OPTIONS,
          useFactory,
          inject: inject ?? [],
        },
        AwsSQSService,
      ],
      exports: [AwsSQSService],
    };
  }
}
