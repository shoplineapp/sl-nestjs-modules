import { Request } from 'express';
import { DeveloperOAuthToken } from './dev-oauth-web.types';

export function getFullUrl(req: Request): string {
  return `${req.protocol}://${req.get('host')}${req.originalUrl}`;
}

export function getTokenExpiryTime(token: DeveloperOAuthToken): Date {
  return new Date((token.createdAt + token.expiresIn) * 1000);
}
