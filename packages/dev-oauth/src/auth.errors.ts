/**
 * The interceptor called without provide token store
 */
export class TokenStoreMissingError extends Error {
  constructor() {
    super('Missing token store when calling GetTokenInterceptor#intercept');
  }
}
