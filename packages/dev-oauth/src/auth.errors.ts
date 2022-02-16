/**
 * The interceptor called without provide read token function
 */
export class ReadTokenFunctionMissingError extends Error {
  constructor() {
    super('Missing read token function when calling GetTokenInterceptor#intercept');
  }
}
