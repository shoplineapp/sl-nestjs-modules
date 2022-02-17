import { Inject, Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DeveloperOAuthOptions } from './dev-oauth-web.options.interface';
import { DEVELOPER_OAUTH_OPTIONS } from './dev-oauth-web.constants';
import { DeveloperOAuthService } from './dev-oauth-web.service';
import { getFullUrl, getTokenExpiryTime } from './dev-oauth-web.utils';
import { DeveloperOAuthToken } from './dev-oauth-web.types';
import { DeveloperOAuthTokenNotFoundError } from './dev-oauth-web.errors';

/**
 * A middleware that checks for tokens in session and select a token to insert into `res.locals`.
 * If no suitable token is presented, then the request will be redirected to the authorization page of the developer oauth server.
 * Apply this middleware to the routes that need oauth protection.
 */
@Injectable()
export class DeveloperOAuthMiddleware implements NestMiddleware {
  private readonly logger: Logger;

  constructor(
    @Inject(DEVELOPER_OAUTH_OPTIONS) private readonly options: DeveloperOAuthOptions,
    private readonly developerOAuthService: DeveloperOAuthService
  ) {
    this.logger = new Logger(DeveloperOAuthMiddleware.name);
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const session: Record<string, any> = req['session'];
      const tokens: DeveloperOAuthToken[] | undefined = session.tokens;
      const currentMerchantId =
        req.params.merchantId ?? req.params.merchant_id ?? (tokens ? this.getDefaultMerchantId(tokens) : undefined);
      const currentToken = tokens
        ? await this.getCurrentToken(tokens, currentMerchantId, req.headers.cookie)
        : undefined;

      if (!currentToken) {
        if (req.xhr) {
          this.logger.error('Token not found for Ajax call');
          throw new DeveloperOAuthTokenNotFoundError();
        }
        this.logger.log('Token not found, redirecting to Developer OAuth');
        session.afterAuthRedirectTo = getFullUrl(req);

        return res.redirect(this.getAuthorizePageUrl(currentMerchantId));
      }
      res.locals.currentToken = currentToken;

      const isTokenExpired = getTokenExpiryTime(currentToken) < new Date();
      if (isTokenExpired) {
        const refreshedToken = await this.developerOAuthService.refreshToken(currentToken.refreshToken);
        Object.assign(currentToken, refreshedToken);
      }

      return next();
    } catch (error) {
      this.logger.error('OAuth authentication failed', { error });
      return res.status(401).send('OAuth authentication failed');
    }
  }

  private getDefaultMerchantId(tokens: DeveloperOAuthToken[]): string | undefined {
    this.logger.log('MerchantId is not specified, randomly picking a merchant and its access token from session');
    const token: DeveloperOAuthToken | undefined = tokens?.slice(-1)[0];
    return token?.merchantId;
  }

  private getAuthorizePageUrl(currentMerchantId: string): string {
    const oauthParams = {
      client_id: this.options.appId,
      response_type: 'code',
      redirect_uri: this.options.redirectUri,
      scope: this.options.scope,
      ...(currentMerchantId ? { merchant_id: currentMerchantId } : undefined),
    };
    const queryString = new URLSearchParams(oauthParams).toString();
    return `${this.options.host}/oauth/authorize?${queryString}`;
  }

  private async getCurrentToken(
    tokens: DeveloperOAuthToken[],
    currentMerchantId: string,
    cookie?: string
  ): Promise<DeveloperOAuthToken | undefined> {
    if (this.options.ensureLoginSession) {
      this.logger.log('Ensure sso login session');
      const currentPerformerId = await this.developerOAuthService.getCurrentStaffId(cookie);
      return tokens?.find(
        (token) => token.merchantId === currentMerchantId && token.performerId === currentPerformerId
      );
    }
    return tokens?.find((token) => token.merchantId === currentMerchantId);
  }
}
