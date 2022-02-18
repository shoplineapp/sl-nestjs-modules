import { ModuleMetadata } from '@nestjs/common/interfaces';

export type DeveloperOAuthRefreshTokenOpts = {
  token: string;
  refreshToken: string;
};

/**
 * The interface to read and store the token
 */
export interface DeveloperOAuthTokenStore {
  /**
   * The function receives a http request and return the token and refresh token
   */
  readToken: (request: any) => Promise<DeveloperOAuthRefreshTokenOpts>;
  /**
   * The function receives the http request and store the new token and refresh token
   */
  writeToken: (request: any, { token, refreshToken }: DeveloperOAuthRefreshTokenOpts) => Promise<void>;
}

/**
 * The configuration interface of the DeveloperOAuthModule
 */
export interface DeveloperOAuthOptions {
  /**
   * The developer center host for checking and refreshing the token
   */
  host: string;
  /**
   * The scope of the refresh token request
   */
  scope: string;
  /**
   * The client id of the refresh token request
   */
  appId: string;
  /**
   * The client secret of the refresh token request, and the secret for validating jwt token
   */
  appSecret: string;
  /**
   * The `DeveloperOAuthTokenStore` interface, should be provided when using get token interceptor
   */
  tokenStore?: DeveloperOAuthTokenStore;
}

export interface DeveloperOAuthOptionsFactory {
  createDeveloperOAuthOptions(): Promise<DeveloperOAuthOptions> | DeveloperOAuthOptions;
}

/**
 * The async configuration interface of the DeveloperOAuthModule
 */
export interface DeveloperOAuthAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<DeveloperOAuthOptions> | DeveloperOAuthOptions;
  inject?: any[];
}
