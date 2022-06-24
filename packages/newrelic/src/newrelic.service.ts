import { Injectable, Inject } from '@nestjs/common';
import { tap, from, Observable } from 'rxjs';
import { Newrelic } from './newrelic.types';
import { NEWRELIC } from './newrelic.constant';

@Injectable()
export class NewrelicService {
  constructor(@Inject(NEWRELIC) private newrelic: Newrelic) {}

  interceptWebTransaction(
    handlerName: string,
    handler: (...args: any[]) => Observable<any>,
  ): Observable<any> {
    return from(
      this.newrelic.startWebTransaction(
        handlerName,
        function () {
          const transaction = this.newrelic.getTransaction();
          return handler().pipe(
            tap({
              next: () => {
                return transaction.end();
              },
              error: (err: any) => {
                this.newrelic.noticeError(err);
                return transaction.end();
              },
            }),
          );
        }.bind(this),
      ),
    );
  }

  startBackgroundTransactionAsync = (
    handlerName: string,
    handler: (...args: any[]) => Promise<void>,
  ) =>
    new Promise((resolve, reject) => {
      this.newrelic.startBackgroundTransaction(handlerName, async () => {
        try {
          const result = await handler();
          resolve(result);
        } catch (error) {
          this.newrelic.noticeError(error);
          reject(error);
        }
      });
    });
}
