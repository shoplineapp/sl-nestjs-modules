import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Credentials, Provider } from '@aws-sdk/types';

/**
 * The configuration interface of the AwsSQSModule
 */
export interface AwsSESOptions {
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
export interface AwsSESAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<AwsSESOptions> | AwsSESOptions;
  inject?: any[];
}
