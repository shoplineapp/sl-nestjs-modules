import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { DeveloperOAuthRefreshTokenOpts } from './auth.options.interface';
import { DeveloperOAuthTokenService } from './auth.token.service';
import { DEVELOPER_OAUTH_OPTIONS } from './constants';
import * as rxjs from 'rxjs';

jest.mock('@nestjs/axios');
jest.mock('rxjs');

describe('AuthTokenService', () => {
  let http: HttpService;
  let service: DeveloperOAuthTokenService;
  const tokenSet: DeveloperOAuthRefreshTokenOpts = {
    token: 'token',
    refreshToken: 'refreshToken',
  };
  const opts = {
    host: 'host',
    scope: 'scope',
    appId: 'appId',
    appSecret: 'appSecret',
    redirectUri: 'redirectUri',
    readToken: async () => tokenSet,
    writeToken: async (request, { token, refreshToken }) => undefined,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: DEVELOPER_OAUTH_OPTIONS, useValue: opts }, DeveloperOAuthTokenService, HttpService],
    }).compile();

    service = module.get(DeveloperOAuthTokenService);
    http = module.get(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#tokenInfo', () => {
    const token = 'test-token';
    const httpRes = {
      data: 'data',
    };

    it('should return token info', async () => {
      const httpSpy = jest.spyOn(http, 'get').mockResolvedValue({} as never);
      jest.spyOn(rxjs, 'lastValueFrom').mockResolvedValue(httpRes);
      await expect(service.tokenInfo(token)).resolves.toBe(httpRes.data);
      expect(httpSpy).toBeCalledWith(`${opts.host}/oauth/token/info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    });
  });

  describe('#refresh', () => {
    const refreshToken = 'test-refreshToken';
    const expectBody = {
      client_id: opts.appId,
      client_secret: opts.appSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
      scope: opts.scope,
    };
    const httpRes = {
      data: { access_token: 'access_token', refresh_token: 'refresh_token' },
    };

    it('should return new token', async () => {
      const httpSpy = jest.spyOn(http, 'post').mockResolvedValue({} as never);
      jest.spyOn(rxjs, 'lastValueFrom').mockResolvedValue(httpRes);
      await expect(service.refresh(refreshToken)).resolves.toEqual({
        token: httpRes.data.access_token,
        refreshToken: httpRes.data.refresh_token,
      });
      expect(httpSpy).toBeCalledWith(`https://${opts.host}/oauth/token`, expectBody);
    });
  });

  describe('#checkExpiry', () => {
    const token = 'test-token';

    it('should return true', async () => {
      const expiredError = {
        response: {
          data: {
            code: 'TOKEN_EXPIRED',
          },
        },
      };
      jest.spyOn(http, 'get').mockResolvedValue({} as never);
      jest.spyOn(rxjs, 'lastValueFrom').mockRejectedValue(expiredError);
      await expect(service.checkExpiry(token)).resolves.toBe(true);
    });

    it('should return false', async () => {
      jest.spyOn(http, 'get').mockResolvedValue({} as never);
      jest.spyOn(rxjs, 'lastValueFrom').mockResolvedValue({} as never);
      await expect(service.checkExpiry(token)).resolves.toBe(false);
    });
  });
});
