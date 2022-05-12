import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import axios from 'axios';
import { DeveloperOAuthOptions } from './dev-oauth-web.options.interface';
import {
  DeveloperOAuthToken,
  DeveloperOAuthTokenInfo,
  DeveloperOAuthTokenInfoResponse,
  DeveloperOAuthTokenResponse,
} from './dev-oauth-web.types';
import { DEVELOPER_OAUTH_OPTIONS } from './dev-oauth-web.constants';
import { DeveloperOAuthUnauthorizedError } from './dev-oauth-web.errors';

function convertTokenInfoResponseToTokenInfo(response: DeveloperOAuthTokenInfoResponse): DeveloperOAuthTokenInfo {
  const tokenInfo: DeveloperOAuthTokenInfo = {
    scope: response.scope,
    merchant: {
      id: response.merchant._id,
      email: response.merchant.email,
      handle: response.merchant.handle,
      name: response.merchant.name,
    },
    staff: {
      id: response.staff._id,
      email: response.staff.email,
      locale: response.staff.locale_code,
      merchantIdList: response.staff.merchant_ids,
      name: response.staff.name,
    },
  };
  return tokenInfo;
}

function convertTokenResponseToToken(response: DeveloperOAuthTokenResponse): DeveloperOAuthToken {
  const token: DeveloperOAuthToken = {
    tokenType: response.token_type,
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
    createdAt: response.created_at,
    expiresIn: response.expires_in,
    scope: response.scope,
    merchantId: response.resource_owner_id,
  };
  return token;
}

/** Service providing interface to the Developer OAuth server */
@Injectable()
export class DeveloperOAuthService {
  private readonly logger: Logger;
  private readonly createTokenCommonParams: Record<string, any>;

  constructor(
    @Inject(DEVELOPER_OAUTH_OPTIONS) private readonly options: DeveloperOAuthOptions,
    private readonly httpService: HttpService
  ) {
    this.logger = new Logger(DeveloperOAuthService.name);
    this.createTokenCommonParams = {
      client_id: this.options.appId,
      client_secret: this.options.appSecret,
      redirect_uri: this.options.redirectUri,
      ensure_login_session: this.options.ensureLoginSession,
      scope: this.options.scope,
      response_type: 'code',
    };
  }

  /**
   * Exchange an authorization code for a token. Should be used in the OAuth flow.
   * @argument authorizationCode Authorization code received in the OAuth callback
   * @returns Exchanged token
   */
  async exchangeCodeForToken(authorizationCode: string): Promise<DeveloperOAuthToken> {
    this.logger.log('Exchanging authorization code for token', { authorizationCode });
    try {
      const res = await lastValueFrom(
        this.httpService.post<DeveloperOAuthTokenResponse>('oauth/token', {
          ...this.createTokenCommonParams,
          code: authorizationCode,
          grant_type: 'authorization_code',
        })
      );
      const token = convertTokenResponseToToken(res.data);
      return token;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        this.logger.error('Failed to exchange authorization code for token due to being unauthorized', {
          authorizationCode,
        });
        throw new DeveloperOAuthUnauthorizedError();
      }
      this.logger.error('Failed to exchange authorization code', { authorizationCode, error });
      throw error;
    }
  }

  /**
   * Refresh a token.
   * @argument refreshToken Refresh token from an existing token
   * @returns Refreshed token
   */
  async refreshToken(refreshToken: string): Promise<DeveloperOAuthToken> {
    this.logger.log('Refreshing token', { refreshToken });
    try {
      const res = await lastValueFrom(
        this.httpService.post<DeveloperOAuthTokenResponse>('oauth/token', {
          ...this.createTokenCommonParams,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        })
      );
      const token = convertTokenResponseToToken(res.data);
      return token;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        this.logger.error('Failed to refresh token due to being unauthorized', {
          refreshToken,
        });
        throw new DeveloperOAuthUnauthorizedError();
      }
      this.logger.error('Failed to refresh token', { refreshToken, error });
      throw error;
    }
  }

  /**
   * Retrieve information of a token
   * @param accessToken Access token from an existing token
   * @returns Token information
   */
  async getTokenInfo(accessToken: string): Promise<DeveloperOAuthTokenInfo> {
    this.logger.log('Getting token info', { accessToken });
    try {
      const res = await lastValueFrom(
        this.httpService.get<DeveloperOAuthTokenInfoResponse>('oauth/token/info', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      );
      const tokenInfo = convertTokenInfoResponseToTokenInfo(res.data);
      return tokenInfo;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        this.logger.error('Failed to get token info due to being unauthorized', { accessToken });
        throw new DeveloperOAuthUnauthorizedError();
      }
      this.logger.error('Failed to get token info', { accessToken, error });
      throw error;
    }
  }

  async getCurrentStaffId(cookie?: string): Promise<string> {
    this.logger.log('Getting current staff id', { cookie });
    try {
      const result = await lastValueFrom(
        this.httpService.get<{ id: string }>('/api/staff/current', {
          headers: { Cookie: cookie ?? '' },
        })
      );
      return result.data.id;
    } catch (error) {
      this.logger.error('Failed to get current staff id', { cookie, error });
      throw error;
    }
  }
}
