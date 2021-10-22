import { Inject } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { DeveloperOAuthOptions } from './auth.options.interface';
import { DEVELOPER_OAUTH_OPTIONS } from './constants';

export class DeveloperOAuthOptionsProvider implements JwtOptionsFactory {
  constructor(@Inject(DEVELOPER_OAUTH_OPTIONS) private opts: DeveloperOAuthOptions) {}
  createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
    const { appSecret } = this.opts;
    return {
      secretOrPrivateKey: appSecret,
      verifyOptions: {
        algorithms: ['HS256'],
      },
    };
  }
}
