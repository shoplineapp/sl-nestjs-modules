import { DynamicModule, Module } from '@nestjs/common';
import { AwsSesService } from './aws-ses.service';

@Module({})
export class AwsSesModule {
  static registerSync(): DynamicModule {
    return {
      module: AwsSesModule,
      imports: [],
      providers: [AwsSesService],
      exports: [AwsSesService],
    };
  }
}
