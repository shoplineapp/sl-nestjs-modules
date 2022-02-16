import { Test, TestingModule } from '@nestjs/testing';
import { DeveloperOAuthRefreshTokenOpts } from './auth.options.interface';
import { DeveloperOAuthTokenService } from './auth.token.service';
import { DEVELOPER_OAUTH_OPTIONS } from './constants';
import { GetTokenInterceptor } from './get-token.interceptor';

jest.mock('./auth.token.service');

describe('AuthTokenService', () => {
  let service: DeveloperOAuthTokenService;
  let interceptor: GetTokenInterceptor;
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
    writeToken: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: DEVELOPER_OAUTH_OPTIONS, useValue: opts },
        DeveloperOAuthTokenService,
        GetTokenInterceptor,
      ],
    }).compile();

    service = module.get(DeveloperOAuthTokenService);
    interceptor = module.get(GetTokenInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('#intercept', () => {
    const request = {};
    const context = {
      switchToHttp: () => {
        return {
          getRequest: () => request,
        };
      },
    };
    const next = {
      handle: () => undefined,
    };
    const newToken = 'newToken';
    const newRefreshToken = 'newRefreshToken';

    it('should call refresh', async () => {
      const checkSpy = jest.spyOn(service, 'checkExpiry').mockResolvedValue(true);
      const refreshSpy = jest
        .spyOn(service, 'refresh')
        .mockResolvedValue({ token: newToken, refreshToken: newRefreshToken });
      await expect(interceptor.intercept(context as never, next)).resolves.toBe(undefined);
      expect(checkSpy).toBeCalledWith(tokenSet.token)
      expect(refreshSpy).toBeCalledWith(tokenSet.refreshToken)
      expect(opts.writeToken).toBeCalledWith(request, { token: newToken, refreshToken: newRefreshToken })
    });

    it('should set token', async () => {
      const checkSpy = jest.spyOn(service, 'checkExpiry').mockResolvedValue(false);
      await expect(interceptor.intercept(context as never, next)).resolves.toBe(undefined);
      expect(checkSpy).toBeCalledWith(tokenSet.token)
    });
  });
});
