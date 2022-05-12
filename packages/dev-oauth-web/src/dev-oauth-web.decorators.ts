import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Response } from 'express';
import { DeveloperOAuthTokenInfoNotFoundError, DeveloperOAuthTokenNotFoundError } from './dev-oauth-web.errors';
import { DeveloperOAuthToken, DeveloperOAuthTokenInfo } from './dev-oauth-web.types';

/**
 * Controller parameter decorator for getting the token from `res.locals`.
 * Use it on routes that has `DeveloperOAuthMiddle` applied.
 */
export const GetOAuthToken = createParamDecorator((data: never, ctx: ExecutionContext) => {
  const res = ctx.switchToHttp().getResponse();
  if (!res.locals.currentToken) {
    throw new DeveloperOAuthTokenNotFoundError();
  }
  return res.locals.currentToken as DeveloperOAuthToken;
});

/**
 * Controller parameter decorator for getting the token info from `res.locals`
 * Use it on routes that has `DeveloperOAuthTokenInfoInterceptor` applied.
 */
export const GetOAuthTokenInfo = createParamDecorator((data: never, ctx: ExecutionContext) => {
  const res: Response = ctx.switchToHttp().getResponse();
  if (!res.locals.tokenInfo) {
    throw new DeveloperOAuthTokenInfoNotFoundError();
  }
  return res.locals.tokenInfo as DeveloperOAuthTokenInfo;
});
