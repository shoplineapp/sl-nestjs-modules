/**
 * @param measurementId Mandatory measurement ID, part of the mandatory URL parameters.
 * @param secret API secret, part of the mandatory URL parameters.
 * For more details of all parameters, see [here](https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events?client_type=gtag#required_parameters)
 */
export interface GoogleAnalyticsConfigOption {
  measurementId: string;
  secret: string;
}

export interface GoogleAnalyticsAsyncConfigOption {
  inject: any[];
  useFactory: (...args: any[]) => GoogleAnalyticsConfigOption | Promise<GoogleAnalyticsConfigOption>;
}
