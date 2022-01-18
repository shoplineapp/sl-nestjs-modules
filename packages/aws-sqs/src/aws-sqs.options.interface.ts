import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Credentials, Provider } from '@aws-sdk/types';

export interface AwsSQSOptions {
  region?: string;
  credentials?: Credentials | Provider<Credentials>;
}

export interface AwsSQSAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<AwsSQSOptions> | AwsSQSOptions;
  inject?: any[];
}
