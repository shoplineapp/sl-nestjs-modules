import { Module, DynamicModule } from '@nestjs/common';
import { NewrelicOptions, NEWRELIC, NewrelicService } from '@sl-nest-module/newrelic';

@Module({})
export class NewrelicModule {
  public static register(opts?: NewrelicOptions): DynamicModule {
    const providers = this.createNewrelicProviders();
    return {
      global: opts?.global || true,
      module: NewrelicModule,
      providers: providers,
      exports: providers,
    };
  }

  private static createNewrelicProviders() {
    return [
      {
        provide: NEWRELIC,
        useValue: {},
      },
      NewrelicService,
    ];
  }
}
