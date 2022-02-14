import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { DeveloperOAuthOptions } from './auth.options.interface';
import { DEVELOPER_OAUTH_OPTIONS } from './constants';

type DeveloperOAuthRefreshTokenOpts = {
  token: string;
  refreshToken: string;
};

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

  async refreshToken({ token, refreshToken }: DeveloperOAuthRefreshTokenOpts) {
    const res = await this.tokenInfo(token);

    if (res.expires_in > 0) return token;

    const refreshRes = await lastValueFrom(
      this.http.post(`${this.opts.host}/oauth/token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        },
      })
    );

    return refreshRes.data;
  }
}
