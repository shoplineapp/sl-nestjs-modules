import { Controller, Get, Inject, Logger, Query, Redirect, Session, UnauthorizedException } from '@nestjs/common';
import { DEVELOPER_OAUTH_OPTIONS } from './dev-oauth-web.constants';
import { DeveloperOAuthUnauthorizedError } from './dev-oauth-web.errors';
import { DeveloperOAuthOptions } from './dev-oauth-web.options.interface';
import { DeveloperOAuthService } from './dev-oauth-web.service';
import { DeveloperOAuthToken } from './dev-oauth-web.types';

@Controller()
export class DeveloperOAuthController {
  private readonly logger: Logger;

  constructor(
    @Inject(DEVELOPER_OAUTH_OPTIONS) options: DeveloperOAuthOptions,
    private readonly developerOAuthService: DeveloperOAuthService
  ) {
    this.logger = new Logger(DeveloperOAuthController.name);
    Get(options.callbackPath)(
      this.constructor,
      'callback',
      Object.getOwnPropertyDescriptor(this.constructor.prototype, 'callback') as never
    );
  }

  /** Handles the callback from the Developer OAuth server in the oauth flow */
  @Redirect()
  async callback(@Query('code') authorizationCode: string, @Session() session: Record<string, any>) {
    try {
      const token = await this.developerOAuthService.exchangeCodeForToken(authorizationCode);
      const tokenInfo = await this.developerOAuthService.getTokenInfo(token.accessToken);
      token.performerId = tokenInfo.staff.id;
      this.insertTokenToSession(session, token);

      const redirectUrl = session.afterAuthRedirectTo ?? '/';
      if (session.afterAuthRedirectTo) {
        delete session.afterAuthRedirectTo;
      }
      this.logger.log('Redirecting after OAuth callback', { redirectUrl });
      return { url: redirectUrl };
    } catch (error) {
      this.logger.error('OAuth callback failed', { error });
      if (error instanceof DeveloperOAuthUnauthorizedError) {
        throw new UnauthorizedException();
      }
      throw error;
    }
  }

  private insertTokenToSession(session: Record<string, any>, token: DeveloperOAuthToken): void {
    if (!session.tokens) {
      session.tokens = [];
    }
    session.tokens.push(token);
    this.logger.log('Inserted token into session', { token });
  }
}
