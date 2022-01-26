import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { GoogleAnalyticsService } from './google-analytics.service';
import { CONFIG_OPTIONS } from './constants';
import { ConfigOptions } from './google-analytics.options.interface';
@Module({})
export class GoogleAnalyticsModule {
  static register(options: ConfigOptions): DynamicModule {
    return {
      global: true,
      module: GoogleAnalyticsModule,
      imports: [HttpModule],
      providers: [
        GoogleAnalyticsService,
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
      ],
      exports: [GoogleAnalyticsService],
    };
  }
}