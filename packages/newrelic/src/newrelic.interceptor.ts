import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { NewrelicService } from './newrelic.service';

@Injectable()
export class NewrelicInterceptor implements NestInterceptor {
  constructor(private newrelicService: NewrelicService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return this.newrelicService.interceptWebTransaction(
      context.getHandler().name,
      next.handle,
    );
  }
}
