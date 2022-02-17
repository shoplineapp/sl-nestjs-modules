import { Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosRequestConfig, AxiosError } from 'axios';
import { DeveloperOAuthService } from './dev-oauth-web.service';
import { DEVELOPER_OAUTH_OPTIONS } from './dev-oauth-web.constants';
import { DeveloperOAuthUnauthorizedError } from './dev-oauth-web.errors';
import { DeveloperOAuthTokenInfoResponse, DeveloperOAuthTokenResponse } from './dev-oauth-web.types';

import { mockDeveloperOAuthOptions, mockDeveloperOAuthToken, mockDeveloperOAuthTokenInfo } from './dev.oauth-web.mocks';

jest.mock('@nestjs/axios');

describe('DeveloperOAuthService', () => {
  let developerOAuthService: DeveloperOAuthService;
  let httpService: HttpService;

  let httpServiceGetSpy: jest.SpyInstance;
  let httpServicePostSpy: jest.SpyInstance;

  let subject: () => any;

  const describeWhenHttpServicePostThrowAnError = () =>
    describe('when httpService.post throw an error', () => {
      describe('when the error is an AxiosError with status 401', () => {
        let mockError: AxiosError;

        beforeEach(() => {
          mockError = { response: { status: 401 }, isAxiosError: true } as never;
          httpServicePostSpy.mockReturnValue(throwError(() => mockError));
        });

        test('throw DeveloperOAuthUnauthorizedError', async () => {
          await expect(subject()).rejects.toBeInstanceOf(DeveloperOAuthUnauthorizedError);
        });
      });

      describe('otherwise', () => {
        let mockError: Error;

        beforeEach(() => {
          mockError = new Error();
          httpServicePostSpy.mockReturnValue(throwError(() => mockError));
        });

        test('rethrow the error', async () => {
          await expect(subject()).rejects.toBe(mockError);
        });
      });
    });

  const describeWhenHttpServicePostReturnADeveloperOAuthTokenResponse = () =>
    describe('when httpService.post return a DeveloperOAuthTokenResponse', () => {
      let mockDeveloperOAuthTokenResponse: DeveloperOAuthTokenResponse;

      beforeEach(() => {
        mockDeveloperOAuthTokenResponse = {
          access_token: mockDeveloperOAuthToken.accessToken,
          token_type: 'Bearer',
          expires_in: mockDeveloperOAuthToken.expiresIn,
          refresh_token: mockDeveloperOAuthToken.refreshToken,
          scope: mockDeveloperOAuthToken.scope,
          created_at: mockDeveloperOAuthToken.createdAt,
          resource_owner_id: mockDeveloperOAuthToken.merchantId,
        };
        httpServicePostSpy.mockReturnValue(of({ data: mockDeveloperOAuthTokenResponse }));
      });

      test('return DeveloperOAuthToken', async () => {
        await expect(subject()).resolves.toEqual(mockDeveloperOAuthToken);
      });
    });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: DEVELOPER_OAUTH_OPTIONS, useValue: mockDeveloperOAuthOptions },
        HttpService,
        DeveloperOAuthService,
      ],
    }).compile();

    developerOAuthService = module.get(DeveloperOAuthService);
    httpService = module.get(HttpService);

    httpServiceGetSpy = jest.spyOn(httpService, 'get');
    httpServicePostSpy = jest.spyOn(httpService, 'post');
  });

  describe('#exchangeCodeForToken', () => {
    let mockAuthorizationCode: string;

    beforeEach(() => {
      mockAuthorizationCode = 'mock-authorization-code';
      subject = () => developerOAuthService.exchangeCodeForToken(mockAuthorizationCode);
    });

    test('call httpService.post', async () => {
      const expectedUrl = 'oauth/token';
      const expectedData = {
        client_id: mockDeveloperOAuthOptions.appId,
        client_secret: mockDeveloperOAuthOptions.appSecret,
        redirect_uri: mockDeveloperOAuthOptions.redirectUri,
        ensure_login_session: mockDeveloperOAuthOptions.ensureLoginSession,
        scope: mockDeveloperOAuthOptions.scope,
        response_type: 'code',
        code: mockAuthorizationCode,
        grant_type: 'authorization_code',
      };

      await subject().catch(() => undefined);
      expect(httpServicePostSpy).toBeCalledTimes(1);
      expect(httpServicePostSpy).toBeCalledWith(expectedUrl, expectedData);
    });

    describeWhenHttpServicePostReturnADeveloperOAuthTokenResponse();

    describeWhenHttpServicePostThrowAnError();
  });

  describe('#refreshToken', () => {
    let mockRefreshToken: string;

    beforeEach(() => {
      mockRefreshToken = 'mock-refresh-code';
      subject = () => developerOAuthService.refreshToken(mockRefreshToken);
    });

    test('call httpService.post', async () => {
      const expectedUrl = 'oauth/token';
      const expectedData = {
        client_id: mockDeveloperOAuthOptions.appId,
        client_secret: mockDeveloperOAuthOptions.appSecret,
        redirect_uri: mockDeveloperOAuthOptions.redirectUri,
        ensure_login_session: mockDeveloperOAuthOptions.ensureLoginSession,
        scope: mockDeveloperOAuthOptions.scope,
        response_type: 'code',
        refresh_token: mockRefreshToken,
        grant_type: 'refresh_token',
      };

      await subject().catch(() => undefined);
      expect(httpServicePostSpy).toBeCalledTimes(1);
      expect(httpServicePostSpy).toBeCalledWith(expectedUrl, expectedData);
    });

    describeWhenHttpServicePostReturnADeveloperOAuthTokenResponse();

    describeWhenHttpServicePostThrowAnError();
  });

  describe('#getTokenInfo', () => {
    let mockAccessToken: string;

    beforeEach(() => {
      mockAccessToken = 'mock-access-token';
      subject = () => developerOAuthService.getTokenInfo(mockAccessToken);
    });

    test('call httpService.get', async () => {
      const expectedUrl = 'oauth/token/info';
      const expectedConfig: AxiosRequestConfig = { headers: { Authorization: 'Bearer mock-access-token' } };

      await subject().catch(() => undefined);
      expect(httpServiceGetSpy).toBeCalledTimes(1);
      expect(httpServiceGetSpy).toBeCalledWith(expectedUrl, expectedConfig);
    });

    describe('when httpService.get return a DeveloperOAuthTokenInfoResponse', () => {
      let mockDeveloperOAuthTokenInfoResponse: DeveloperOAuthTokenInfoResponse;

      beforeEach(() => {
        mockDeveloperOAuthTokenInfoResponse = {
          resource_owner_id: mockDeveloperOAuthTokenInfo.merchant.id,
          scope: mockDeveloperOAuthTokenInfo.scope,
          expires_in: 0,
          application: { uid: 'mock-app-id' },
          created_at: Date.now() / 1000,
          staff: {
            _id: mockDeveloperOAuthTokenInfo.staff.id,
            email: mockDeveloperOAuthTokenInfo.staff.email,
            locale_code: mockDeveloperOAuthTokenInfo.staff.locale,
            merchant_ids: mockDeveloperOAuthTokenInfo.staff.merchantIdList,
            name: mockDeveloperOAuthTokenInfo.staff.name,
          },
          merchant: {
            _id: mockDeveloperOAuthTokenInfo.merchant.id,
            email: mockDeveloperOAuthTokenInfo.merchant.email,
            handle: mockDeveloperOAuthTokenInfo.merchant.handle,
            name: mockDeveloperOAuthTokenInfo.merchant.name,
          },
        };
        httpServiceGetSpy.mockReturnValue(of({ data: mockDeveloperOAuthTokenInfoResponse }));
      });

      test('return DeveloperOAuthTokenInfo', async () => {
        await expect(subject()).resolves.toEqual(mockDeveloperOAuthTokenInfo);
      });
    });

    describe('when httpService.get throw an error', () => {
      describe('when the error is an AxiosError with status 401', () => {
        let mockError: AxiosError;

        beforeEach(() => {
          mockError = { response: { status: 401 }, isAxiosError: true } as never;
          httpServiceGetSpy.mockReturnValue(throwError(() => mockError));
        });

        test('throw DeveloperOAuthUnauthorizedError', async () => {
          await expect(subject()).rejects.toBeInstanceOf(DeveloperOAuthUnauthorizedError);
        });
      });

      describe('otherwise', () => {
        let mockError: Error;

        beforeEach(() => {
          mockError = new Error();
          httpServiceGetSpy.mockReturnValue(throwError(() => mockError));
        });

        test('rethrow the error', async () => {
          await expect(subject()).rejects.toBe(mockError);
        });
      });
    });
  });

  describe('#getCurrentStaffId', () => {
    let mockCookie: string;
    let mockStaffId: string;

    beforeEach(() => {
      mockCookie = 'mock-cookie';
      mockStaffId = 'mock-staff-id';
      subject = () => developerOAuthService.getCurrentStaffId(mockCookie);
      httpServiceGetSpy.mockReturnValue(of({ data: { id: mockStaffId } }));
    });

    test('call httpService.get', async () => {
      const expectedUrl = '/api/staff/current';
      const expectedConfig: AxiosRequestConfig = { headers: { Cookie: mockCookie } };

      await subject();
      expect(httpServiceGetSpy).toBeCalledTimes(1);
      expect(httpServiceGetSpy).toBeCalledWith(expectedUrl, expectedConfig);
    });

    test('return the current staff id', async () => {
      await expect(subject()).resolves.toEqual(mockStaffId);
    });
  });
});
