import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DeveloperOAuthOptions } from './auth.options.interface';
import { DEVELOPER_OAUTH_OPTIONS } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(DEVELOPER_OAUTH_OPTIONS) opts: DeveloperOAuthOptions) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: opts.appSecret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, merchantId: payload.data.merchant_id };
  }
}
