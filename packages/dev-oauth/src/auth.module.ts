import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DeveloperOAuthOptionsProvider } from './auth.options.provider';
import { DeveloperOAuthAsyncOptions, DeveloperOAuthOptions } from './auth.options.interface';
import { DEVELOPER_OAUTH_OPTIONS } from './constants';
import { JwtStrategy } from './jwt.strategies';
import { HttpModule } from '@nestjs/axios';
import { DeveloperOAuthTokenService } from './auth.token.service';

/**
 * [Shopline Developer Center OAuth](https://shopline-developers.readme.io/docs/get-started) module for [NestJS](https://docs.nestjs.com/) project
 */
@Module({})
export class DeveloperOAuthModule {
  /**
   * Initialize the module
   * @param opts Configuration option
   * @return A dynamic `DeveloperOAuthModule`
   */
  static forRoot(opts: DeveloperOAuthOptions): DynamicModule {
    const { appSecret } = opts;
    return {
      global: true,
      module: DeveloperOAuthModule,
      imports: [
        HttpModule,
        JwtModule.register({
          secretOrPrivateKey: appSecret,
          verifyOptions: {
            algorithms: ['HS256'],
          },
        }),
      ],
      exports: [DeveloperOAuthTokenService],
      providers: [
        {
          provide: DEVELOPER_OAUTH_OPTIONS,
          useValue: opts,
        },
        JwtStrategy,
        DeveloperOAuthTokenService,
      ],
    };
  }

  /**
   * Initialize the module
   * @param asyncOptions Configuration option
   * @return A dynamic `DeveloperOAuthModule`
   */
  static forRootAsync({ useFactory, inject, imports }: DeveloperOAuthAsyncOptions): DynamicModule {
    return {
      global: true,
      module: DeveloperOAuthModule,
      imports: [
        ...imports,
        HttpModule,
        JwtModule.registerAsync({
          useClass: DeveloperOAuthOptionsProvider,
          inject: [DEVELOPER_OAUTH_OPTIONS],
        }),
      ],
      exports: [DEVELOPER_OAUTH_OPTIONS, DeveloperOAuthTokenService],
      providers: [
        {
          provide: DEVELOPER_OAUTH_OPTIONS,
          useFactory,
          inject: inject ?? [],
        },
        JwtStrategy,
        DeveloperOAuthTokenService,
        DeveloperOAuthOptionsProvider,
      ],
    };
  }
}
