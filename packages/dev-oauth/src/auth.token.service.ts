import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { DeveloperOAuthOptions, DeveloperOAuthRefreshTokenOpts } from './auth.options.interface';
import { DEVELOPER_OAUTH_OPTIONS } from './constants';

@Injectable()
export class DeveloperOAuthTokenService {
  constructor(@Inject(DEVELOPER_OAUTH_OPTIONS) private opts: DeveloperOAuthOptions, private http: HttpService) {}

  async tokenInfo(token: string) {
    const res = await lastValueFrom(
      this.http.get(`${this.opts.host}/oauth/token/info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    );

    return res.data;
  }

  async refresh(refreshToken: string): Promise<DeveloperOAuthRefreshTokenOpts> {
    const requestBody = {
      client_id: this.opts.appId,
      client_secret: this.opts.appSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
      scope: this.opts.scope,
    };

    const response = await lastValueFrom(this.http.post(`https://${this.opts.host}/oauth/token`, requestBody));

    return {
      token: response.data.access_token,
      refreshToken: response.data.refresh_token,
    };
  }

  async checkExpiry(token: string): Promise<boolean> {
    try {
      await this.tokenInfo(token)
    } catch (error) {
      if (error.response?.data?.code === 'TOKEN_EXPIRED') {
        return true;
      }
      throw error;
    }
    return false;
  }
}
