import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Credentials, Provider } from '@aws-sdk/types';

/**
 * The configuration interface of the AwsSQSModule
 */
export interface AwsSQSOptions {
  /**
   * The AWS region
   */
  region?: string;
  /**
   * The AWS credentials to use with the AWS SDK
   */
  credentials?: Credentials | Provider<Credentials>;
}

/**
 * The async configuration interface of the AwsSQSModule
 */
export interface AwsSQSAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<AwsSQSOptions> | AwsSQSOptions;
  inject?: any[];
}
