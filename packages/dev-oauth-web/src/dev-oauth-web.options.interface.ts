import { ModuleMetadata } from '@nestjs/common/interfaces';

/** The configuration interface of `DeveloperOAuthModule` */
export interface DeveloperOAuthOptions {
  /**
   * Developer OAuth host server's URL
   * @example 'developers.shoplineapp.com'
   */
  host: string;

  /** App UID provided in Developer Center */
  appId: string;

  /** App secret provided in Developer Center */
  appSecret: string;

  /**
   * App scopes, separated by spaces
   * @example 'orders merchants'
   */
  scope: string;

  /**
   * The redirect URI to be used in the OAuth flow
   * @example http://my-app.com
   */
  redirectUri: string;

  /**
   * When true, the `DeveloperOAuthMiddleware` will select a token using its performerId and merchantId,
   * otherwise the token will be selected only by its merchantId
   */
  ensureLoginSession?: boolean;

  /**
   * The API path to handle the callback in the OAuth flow
   * @default 'oauth'
   */
  callbackPath?: string;
}

/**
 * The async configuration interface of the `DeveloperOAuthModule`
 */
export interface DeveloperOAuthAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  /** Array of dependencies which will be injected to the `useFactory` function as arguments in the same order */
  inject: any[];

  /** Factory function to provide the `DeveloperOAuthOptions` for the module */
  useFactory: (...args: any[]) => Promise<DeveloperOAuthOptions> | DeveloperOAuthOptions;
}
