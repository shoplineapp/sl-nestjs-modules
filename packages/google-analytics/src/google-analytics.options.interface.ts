export interface GoogleAnalyticsConfigOption {
  id: string;
  secret: string;
}

export interface GoogleAnalyticsAsyncConfigOption {
  inject: any[];
  useFactory: (...args: any[]) => GoogleAnalyticsConfigOption | Promise<GoogleAnalyticsConfigOption>;
}
