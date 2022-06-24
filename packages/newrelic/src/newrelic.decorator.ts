import { Inject } from '@nestjs/common';
import { NewrelicService } from './newrelic.service';

export function StartBackgroundTransaction(handlerName: string) {
  const injectNewrelicService = Inject(NewrelicService);
  return (
    target: any,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor,
  ) => {
    injectNewrelicService(target, 'newrelicService');
    const backgroundJob = propertyDescriptor.value;
    propertyDescriptor.value = function (...args: any[]) {
      return this.newrelicService.startBackgroundTransactionAsync(
        handlerName,
        () => backgroundJob.apply(this, args),
      );
    };
  };
}
