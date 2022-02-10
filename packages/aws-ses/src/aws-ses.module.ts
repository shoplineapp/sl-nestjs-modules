import { DynamicModule, Module } from '@nestjs/common';
import { AwsSESAsyncOptions, AwsSESOptions } from './aws-ses.options.interface';
import { AwsSESService } from './aws-ses.service';
import { AWS_SES_OPTIONS } from './constants';

/**
 * [AWS SQS](https://aws.amazon.com/sqs/) module for [NestJS](https://docs.nestjs.com/) project
 */
@Module({})
export class AwsSESModule {
  /**
   * Initialize the module
   * @param opts Configuration option
   * @return A dynamic `AwsSQSModule`
   */
  static register(opts: AwsSESOptions): DynamicModule {
    return {
      module: AwsSESModule,
      providers: [
        {
          provide: AWS_SES_OPTIONS,
          useValue: opts,
        },
        AwsSESService,
      ],
      exports: [AwsSESService],
    };
  }

  /**
   * Initialize the module
   * @param asyncOptions Configuration option
   * @return A dynamic `AwsSQSModule`
   */
  static registerAsync({ useFactory, inject }: AwsSESAsyncOptions): DynamicModule {
    return {
      module: AwsSESModule,
      providers: [
        {
          provide: AWS_SES_OPTIONS,
          useFactory,
          inject: inject ?? [],
        },
        AwsSESService,
      ],
      exports: [AwsSESService],
    };
  }
}
