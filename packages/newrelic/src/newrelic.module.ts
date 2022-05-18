import * as newrelic from 'newrelic';
import { Module, DynamicModule } from '@nestjs/common';
import { NewrelicOptions } from './newrelic.options.interface';
import { NEWRELIC } from './newrelic.constant';
import { NewrelicService } from './newrelic.service';

@Module({})
export class NewrelicModule {
  /**
   * Initialize the module
   * @param opts Configuration option
   * @return A dynamic `NewrelicModule`
   */
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
        useValue: newrelic,
      },
      NewrelicService,
    ];
  }
}
