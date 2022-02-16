import { ModuleMetadata } from '@nestjs/common/interfaces';

export type DeveloperOAuthRefreshTokenOpts = {
  token: string;
  refreshToken: string;
};

export interface DeveloperOAuthOptions {
  host: string;
  scope: string;
  appId: string;
  appSecret: string;
  redirectUri?: string;
  readToken?: (request: any) => Promise<DeveloperOAuthRefreshTokenOpts>;
  writeToken?: (request: any, { token, refreshToken }: DeveloperOAuthRefreshTokenOpts) => Promise<void>;
}

export interface DeveloperOAuthOptionsFactory {
  createDeveloperOAuthOptions(): Promise<DeveloperOAuthOptions> | DeveloperOAuthOptions;
}

export interface DeveloperOAuthAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<DeveloperOAuthOptions> | DeveloperOAuthOptions;
  inject?: any[];
}
