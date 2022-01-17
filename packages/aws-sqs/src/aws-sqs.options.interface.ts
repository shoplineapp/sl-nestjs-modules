import { ModuleMetadata } from '@nestjs/common/interfaces';

export interface AwsSQSOptions {
  region: string;
  roleArn: string;
  webIdentityToken: string;
}

export interface AwsSQSAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<AwsSQSOptions> | AwsSQSOptions;
  inject?: any[];
}
