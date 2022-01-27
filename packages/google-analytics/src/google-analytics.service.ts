import { HttpService } from '@nestjs/axios';
import { Injectable, Inject } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { GA_CONFIG_OPTIONS } from './constants';
import { GoogleAnalyticsConfigOption } from './google-analytics.options.interface';

@Injectable()
export class GoogleAnalyticsService {
  constructor(
    @Inject(GA_CONFIG_OPTIONS) private options: GoogleAnalyticsConfigOption,
    private readonly http: HttpService
  ) {}

  async logEvent(clientId: string, eventName: string, eventPayload: any) {
    try {
      const { id, secret } = this.options;

      const data = {
        client_id: clientId,
        events: [
          {
            name: eventName,
            params: eventPayload,
          },
        ],
      };
      const res = await lastValueFrom(
        this.http.post(`https://www.google-analytics.com/mp/collect?measurement_id=${id}&api_secret=${secret}`, data)
      );

      return res;
    } catch (err) {
      throw err;
    }
  }
}
