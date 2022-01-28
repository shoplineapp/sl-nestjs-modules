import { GoogleAnalyticsService } from './google-analytics.service';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import * as rxjs from 'rxjs';
import { GA_CONFIG_OPTIONS } from './constants';

jest.mock('@nestjs/axios');
jest.mock('rxjs');

describe('GoogleAnalyticsService', () => {
  let service: GoogleAnalyticsService;
  let http: HttpService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpService,
        GoogleAnalyticsService,
        {
          provide: GA_CONFIG_OPTIONS,
          useValue: {
            measurementId: 'id',
            secret: 'secret',
          },
        },
      ],
    }).compile();

    service = module.get(GoogleAnalyticsService);
    http = module.get(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logEvent', () => {
    const merchantId = 'merchant-id';
    const type = 'type';
    const dto = {
      merchantId,
      type,
    };

    const data = {
      client_id: 'client',
      events: [
        {
          name: 'pdf_download',
          params: dto,
        },
      ],
    };
    const url = `https://www.google-analytics.com/mp/collect?measurement_id=id&api_secret=secret`;

    it('logEvent', async () => {
      const httpSpy = jest.spyOn(http, 'post');
      jest.spyOn(rxjs, 'lastValueFrom').mockReturnValue({} as never);
      httpSpy.mockResolvedValue({} as never);

      const result = await service.logEvent('client', 'pdf_download', dto as never);

      expect(httpSpy).toBeCalledWith(url, data);
      expect(result).toMatchObject({});
    });
  });
});
