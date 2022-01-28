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

  /**
   * Invoke a logEvent function
   * @param clientId Mandatory client ID.
   * @param eventName Required event name for the post body posted to Google Analytics via logEvent.
   * @param eventPayload Optional event payload for the post body posted to Google Analytics via logEvent.
   * @returns Payload responded from the logEvent function
   * For more details of all parameters, see [here](https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=gtag#payload_post_body)
   */
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
