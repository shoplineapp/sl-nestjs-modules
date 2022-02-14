import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { GoogleAnalyticsService } from './google-analytics.service';
import { GA_CONFIG_OPTIONS } from './constants';
import { GoogleAnalyticsConfigOption, GoogleAnalyticsAsyncConfigOption } from './google-analytics.options.interface';
@Module({})
export class GoogleAnalyticsModule {
  static register(options: GoogleAnalyticsConfigOption): DynamicModule {
    return {
      module: GoogleAnalyticsModule,
      imports: [HttpModule],
      providers: [
        GoogleAnalyticsService,
        {
          provide: GA_CONFIG_OPTIONS,
          useValue: options,
        },
      ],
      exports: [GoogleAnalyticsService],
    };
  }

  static registerAsync({ inject, useFactory }: GoogleAnalyticsAsyncConfigOption): DynamicModule {
    return {
      module: GoogleAnalyticsModule,
      imports: [HttpModule],
      providers: [
        GoogleAnalyticsService,
        {
          provide: GA_CONFIG_OPTIONS,
          inject,
          useFactory,
        },
      ],
      exports: [GoogleAnalyticsService],
    };
  }
}
