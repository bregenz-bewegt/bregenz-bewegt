import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import * as lodash from 'lodash';
import deepdash from 'deepdash';
const _ = deepdash(lodash);

@Injectable()
export class MapParkImagePathInterceptor implements NestInterceptor {
  private keysToBeMapped: (string | number)[] = ['image'];

  private mapImagePath<T = any>(value: T): T {
    const mapped = _.mapValuesDeep(value, (value, key) => {
      if (!this.keysToBeMapped.includes(key) || _.isNil(value)) return value;

      return `${process.env['NX_API_BASE_URL']}/static/${value}`;
    });

    return mapped;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((value) => this.mapImagePath(value)));
  }
}
