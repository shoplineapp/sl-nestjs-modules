import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { DeveloperOAuthTokenNotFoundError } from './dev-oauth-web.errors';
import { DeveloperOAuthService } from './dev-oauth-web.service';
import { DeveloperOAuthToken } from './dev-oauth-web.types';

/**
 * Interceptor that gets the token from `res.locals` and then request the token info from the Developer Oauth server to insert it in `res.locals`.
 * Only use it on a route that has `DeveloperOAuthMiddleware` applied.
 */
@Injectable()
export class DeveloperOAuthTokenInfoInterceptor implements NestInterceptor {
  private readonly logger: Logger;

  constructor(private readonly developerOAuthService: DeveloperOAuthService) {
    this.logger = new Logger(DeveloperOAuthTokenInfoInterceptor.name);
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const httpArgsHost = context.switchToHttp();
    const res = httpArgsHost.getResponse<Response>();
    const token: DeveloperOAuthToken | undefined = res.locals.currentToken;
    if (!token) {
      this.logger.error('Token cannot be found');
      throw new DeveloperOAuthTokenNotFoundError();
    }
    res.locals.tokenInfo = await this.developerOAuthService.getTokenInfo(token.accessToken);
    return next.handle();
  }
}
