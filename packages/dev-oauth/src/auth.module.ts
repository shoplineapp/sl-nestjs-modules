import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DeveloperOAuthOptionsProvider } from './auth.options.provider';
import { DeveloperOAuthAsyncOptions, DeveloperOAuthOptions } from './auth.options.interface';
import { DEVELOPER_OAUTH_OPTIONS } from './constants';
import { JwtStrategy } from './jwt.strategies';
import { HttpModule } from '@nestjs/axios';
import { DeveloperOAuthTokenService } from './auth.token.service';

@Module({})
export class DeveloperOAuthModule {
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
      exports: [DEVELOPER_OAUTH_OPTIONS],
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
