import { DeveloperOAuthOptions } from './dev-oauth-web.options.interface';
import { DeveloperOAuthToken, DeveloperOAuthTokenInfo } from './dev-oauth-web.types';

export const mockDeveloperOAuthOptions: DeveloperOAuthOptions = {
  host: 'mock-developer-oauth.com',
  appId: 'mock-app-id',
  appSecret: 'mockAppSecret',
  scope: 'mock-scope',
  redirectUri: 'mock-redirect-uri.com',
  callbackPath: 'mock-callback-path',
};

export const mockDeveloperOAuthToken: DeveloperOAuthToken = {
  tokenType: 'Bearer',
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  createdAt: Date.now() / 1000,
  expiresIn: 0,
  scope: 'mock-scope',
  merchantId: 'mock-merchant-id',
};

export const mockDeveloperOAuthTokenInfo: DeveloperOAuthTokenInfo = {
  scope: ['mock-scope-1', 'mock-scope-2'],
  merchant: {
    id: 'mock-merchant-id',
    email: 'mock-merchant-email',
    handle: 'mock-merchant-handle',
    name: 'mock-merchant-name',
  },
  staff: {
    id: 'mock-staff-id',
    email: 'mock-staff-email',
    locale: 'mock-staff-locale',
    merchantIdList: ['mock-merchant-id'],
    name: 'mock-staff-name',
  },
};
