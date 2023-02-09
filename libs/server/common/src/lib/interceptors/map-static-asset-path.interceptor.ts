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
export class MapStaticAssetPathInterceptor implements NestInterceptor {
  private keysToBeMapped: PropertyKey[];

  constructor(keysToBeMapped: PropertyKey[] = ['image', 'video']) {
    this.keysToBeMapped = keysToBeMapped;
  }

  private mapImagePath<T = any>(value: T): T {
    const mapped = _.mapValuesDeep(value, (value, key) => {
      if (!this.keysToBeMapped.includes(key) || _.isNil(value)) return value;

      return `${process.env['NX_API_BASE_URL']}/api/static/${value}`;
    });

    return mapped;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((value) => this.mapImagePath(value)));
  }
}
