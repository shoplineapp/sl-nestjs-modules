import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DeveloperOAuthOptions } from './auth.options.interface';
import { DeveloperOAuthTokenService } from './auth.token.service';
import { DEVELOPER_OAUTH_OPTIONS } from './constants';

@Injectable()
export class GetTokenInterceptor implements NestInterceptor {
  constructor(
    @Inject(DEVELOPER_OAUTH_OPTIONS) private opts: DeveloperOAuthOptions,
    private service: DeveloperOAuthTokenService
  ) {}

  async intercept<T>(context: ExecutionContext, next: CallHandler): Promise<Observable<T>> {
    const request = context.switchToHttp().getRequest();
    const { token, refreshToken } = await this.opts.readToken(request);
    const isTokenExpired = await this.service.checkExpiry(token);

    if (isTokenExpired) {
      const { token: newToken, refreshToken: newRefreshToken } = await this.service.refresh(refreshToken);
      if (this.opts.writeToken) await this.opts.writeToken(request, { token: newToken, refreshToken: newRefreshToken });
      request.token = newToken;
      return next.handle();
    }

    request.token = token;
    return next.handle();
  }
}
