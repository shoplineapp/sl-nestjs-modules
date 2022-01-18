import { DynamicModule, Module } from '@nestjs/common';
import { AwsSQSAsyncOptions, AwsSQSOptions } from './aws-sqs.options.interface';
import { AwsSQSService } from './aws-sqs.service';
import { AWS_SQS_OPTIONS } from './constants';

@Module({})
export class AwsSQSModule {
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
