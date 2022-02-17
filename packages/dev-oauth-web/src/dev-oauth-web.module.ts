import { DynamicModule, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DeveloperOAuthAsyncOptions, DeveloperOAuthOptions } from './dev-oauth-web.options.interface';
import { DEVELOPER_OAUTH_OPTIONS } from './dev-oauth-web.constants';
import { DeveloperOAuthService } from './dev-oauth-web.service';
import { DeveloperOAuthController } from './dev-oauth-web.controller';

const defaultOptions: Partial<DeveloperOAuthOptions> = {
  ensureLoginSession: false,
  callbackPath: 'oauth',
};

/** Module that integrates OAuth flow with a Shopline Developer OAuth server. This should be used in a web backend project */
@Module({})
export class DeveloperOAuthModule {
  /**
   * Initialize the module
   * @param options Configuration option
   * @returns A dynamic `DeveloperOAuthModule`
   */
  static forRoot(options: DeveloperOAuthOptions): DynamicModule {
    return {
      global: true,
      module: DeveloperOAuthModule,
      imports: [HttpModule.register({ baseURL: options.host })],
      providers: [
        {
          provide: DEVELOPER_OAUTH_OPTIONS,
          useValue: { ...defaultOptions, ...options },
        },
        DeveloperOAuthService,
      ],
      controllers: [DeveloperOAuthController],
      exports: [DeveloperOAuthService, DEVELOPER_OAUTH_OPTIONS],
    };
  }

  /**
   * Initialize the module
   * @param asyncOptions Async configuration option
   * @return A dynamic `DeveloperOAuthModule`
   */
  static forRootAsync({ useFactory, inject }: DeveloperOAuthAsyncOptions): DynamicModule {
    return {
      global: true,
      module: DeveloperOAuthModule,
      imports: [
        HttpModule.registerAsync({
          useFactory: (options: DeveloperOAuthOptions) => ({ baseURL: options.host }),
          inject: [DEVELOPER_OAUTH_OPTIONS],
        }),
      ],
      controllers: [DeveloperOAuthController],
      providers: [
        {
          provide: DEVELOPER_OAUTH_OPTIONS,
          useFactory: async (...args: any[]) => {
            const options = await useFactory(...args);
            return { ...defaultOptions, ...options };
          },
          inject,
        },
        DeveloperOAuthService,
      ],
      exports: [DeveloperOAuthService, DEVELOPER_OAUTH_OPTIONS],
    };
  }
}
