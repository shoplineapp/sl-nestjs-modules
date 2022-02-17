import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DEVELOPER_OAUTH_OPTIONS } from './dev-oauth-web.constants';
import { DeveloperOAuthController } from './dev-oauth-web.controller';
import { DeveloperOAuthUnauthorizedError } from './dev-oauth-web.errors';
import { DeveloperOAuthModule } from './dev-oauth-web.module';
import { DeveloperOAuthService } from './dev-oauth-web.service';
import { mockDeveloperOAuthOptions, mockDeveloperOAuthToken, mockDeveloperOAuthTokenInfo } from './dev.oauth-web.mocks';

jest.mock('./dev-oauth-web.service');

describe('DeveloperOAuthController', () => {
  let developerOAuthController: DeveloperOAuthController;
  let developerOAuthService: DeveloperOAuthService;

  let subject: () => any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: DEVELOPER_OAUTH_OPTIONS, useValue: mockDeveloperOAuthOptions },
        DeveloperOAuthService,
        DeveloperOAuthController,
      ],
    }).compile();

    developerOAuthController = module.get(DeveloperOAuthController);
    developerOAuthService = module.get(DeveloperOAuthService);
  });

  const describeWhenDeveloperOAuthServiceThrowAnError = (methodName: string, methodSpy: jest.SpyInstance) =>
    describe(`when developerOAuthService.${methodName} throw an error`, () => {
      describe('when the error is a DeveloperOAuthUnauthorizedError', () => {
        let mockError: DeveloperOAuthUnauthorizedError;

        beforeEach(() => {
          mockError = new DeveloperOAuthUnauthorizedError();
          methodSpy.mockRejectedValue(mockError);
        });

        test('throw an UnauthorizedException', async () => {
          await expect(subject()).rejects.toBeInstanceOf(UnauthorizedException);
        });
      });

      describe('otherwise', () => {
        let mockError: Error;

        beforeEach(() => {
          mockError = new Error();
          methodSpy.mockRejectedValue(mockError);
        });

        test('rethrow the error', async () => {
          await expect(subject()).rejects.toBe(mockError);
        });
      });
    });

  describe('#callback', () => {
    let mockAuthorizationCode: string;
    let mockSession: Record<string, any>;

    let developerOAuthServiceExchangeCodeForTokenSpy: jest.SpyInstance;
    let developerOAuthServiceGetTokenInfoSpy: jest.SpyInstance;

    beforeEach(() => {
      mockAuthorizationCode = 'mock-authorization-code';
      mockSession = {};
      subject = () => developerOAuthController.callback(mockAuthorizationCode, mockSession);
      developerOAuthServiceExchangeCodeForTokenSpy = jest.spyOn(developerOAuthService, 'exchangeCodeForToken');
      developerOAuthServiceGetTokenInfoSpy = jest.spyOn(developerOAuthService, 'getTokenInfo');
    });

    test('call developerOAuthService.exchangeCodeForToken', async () => {
      await subject().catch(() => undefined);
      expect(developerOAuthServiceExchangeCodeForTokenSpy).toBeCalledTimes(1);
      expect(developerOAuthServiceExchangeCodeForTokenSpy).toBeCalledWith(mockAuthorizationCode);
    });

    describe('when developerOAuthService.exchangeCodeForToken return a DeveloperOAuthToken', () => {
      beforeEach(() => {
        developerOAuthServiceExchangeCodeForTokenSpy.mockResolvedValue(mockDeveloperOAuthToken);
      });

      test('call developerOAuthService.getTokenInfo', async () => {
        await subject().catch(() => undefined);
        expect(developerOAuthServiceGetTokenInfoSpy).toBeCalledTimes(1);
        expect(developerOAuthServiceGetTokenInfoSpy).toBeCalledWith(mockDeveloperOAuthToken.accessToken);
      });

      describe('when developerOAuthService.getTokenInfo return a DeveloperOAuthTokenInfo', () => {
        beforeEach(() => {
          developerOAuthServiceGetTokenInfoSpy.mockResolvedValue(mockDeveloperOAuthTokenInfo);
        });

        test('insert the DeveloperOAuthToken into session', async () => {
          const expectedToken: DeveloperOAuthModule = {
            ...mockDeveloperOAuthToken,
            performerId: mockDeveloperOAuthTokenInfo.staff.id,
          };

          await subject();
          expect(mockSession.tokens).toContainEqual(expectedToken);
        });

        describe('when the session has afterAuthRedirectTo', () => {
          let mockAfterAuthRedirectTo: string;

          beforeEach(() => {
            mockAfterAuthRedirectTo = 'mock-after-auth-redirect-to';
            mockSession.afterAuthRedirectTo = mockAfterAuthRedirectTo;
          });

          test('return redirection to afterAuthRedirectTo', async () => {
            await expect(subject()).resolves.toEqual({ url: mockAfterAuthRedirectTo });
          });

          test('delete afterAuthRedirectTo from session', async () => {
            await subject();
            expect(mockSession.afterAuthRedirectTo).toBeUndefined();
          });
        });

        describe('when the session does not have afterAuthRedirectTo', () => {
          test('return redirection to `/`', async () => {
            await expect(subject()).resolves.toEqual({ url: '/' });
          });
        });
      });

      describe(`when developerOAuthService.getTokenInfo throw an error`, () => {
        describe('when the error is a DeveloperOAuthUnauthorizedError', () => {
          let mockError: DeveloperOAuthUnauthorizedError;

          beforeEach(() => {
            mockError = new DeveloperOAuthUnauthorizedError();
            developerOAuthServiceGetTokenInfoSpy.mockRejectedValue(mockError);
          });

          test('throw an UnauthorizedException', async () => {
            await expect(subject()).rejects.toBeInstanceOf(UnauthorizedException);
          });
        });

        describe('otherwise', () => {
          let mockError: Error;

          beforeEach(() => {
            mockError = new Error();
            developerOAuthServiceGetTokenInfoSpy.mockRejectedValue(mockError);
          });

          test('rethrow the error', async () => {
            await expect(subject()).rejects.toBe(mockError);
          });
        });
      });
    });

    describe(`when developerOAuthService.exchangeCodeForToken throw an error`, () => {
      describe('when the error is a DeveloperOAuthUnauthorizedError', () => {
        let mockError: DeveloperOAuthUnauthorizedError;

        beforeEach(() => {
          mockError = new DeveloperOAuthUnauthorizedError();
          developerOAuthServiceExchangeCodeForTokenSpy.mockRejectedValue(mockError);
        });

        test('throw an UnauthorizedException', async () => {
          await expect(subject()).rejects.toBeInstanceOf(UnauthorizedException);
        });
      });

      describe('otherwise', () => {
        let mockError: Error;

        beforeEach(() => {
          mockError = new Error();
          developerOAuthServiceExchangeCodeForTokenSpy.mockRejectedValue(mockError);
        });

        test('rethrow the error', async () => {
          await expect(subject()).rejects.toBe(mockError);
        });
      });
    });
  });
});
