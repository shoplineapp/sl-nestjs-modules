import { DynamicModule, Module } from '@nestjs/common';
import { AwsS3Service } from './aws-s3.service';
import { AwsS3AsyncOptions, AwsS3Options } from './aws-s3.interfaces';
import { AWS_S3_OPTIONS } from './aws-s3.constants';

/**
 * [AWS S3](https://aws.amazon.com/s3/) module that interface with [@aws-sdk/client-s3](https://www.npmjs.com/package/@aws-sdk/client-s3) behind the scene
 */
@Module({})
export class AwsS3Module {
  /**
   * Initialize the module
   * @param options Configuration option
   * @returns A dynamic `AwsS3Module`
   */
  static register(options: AwsS3Options): DynamicModule {
    return {
      module: AwsS3Module,
      providers: [{ provide: AWS_S3_OPTIONS, useValue: options }, AwsS3Service],
      exports: [AwsS3Service],
    };
  }

  /**
   * Initialize the module
   * @param asyncOptions Async Configuration option
   * @returns A dynamic `AwsS3Module`
   */
  static registerAsync({ inject, useFactory }: AwsS3AsyncOptions): DynamicModule {
    return {
      module: AwsS3Module,
      providers: [{ provide: AWS_S3_OPTIONS, inject, useFactory }, AwsS3Service],
      exports: [AwsS3Service],
    };
  }
}
