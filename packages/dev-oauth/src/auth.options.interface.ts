import { ModuleMetadata } from '@nestjs/common/interfaces';

export interface DeveloperOAuthOptions {
  host: string;
  appId: string;
  appSecret: string;
  redirectUri?: string;
}

export interface DeveloperOAuthOptionsFactory {
  createDeveloperOAuthOptions(): Promise<DeveloperOAuthOptions> | DeveloperOAuthOptions;
}

export interface DeveloperOAuthAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<DeveloperOAuthOptions> | DeveloperOAuthOptions;
  inject?: any[];
}
