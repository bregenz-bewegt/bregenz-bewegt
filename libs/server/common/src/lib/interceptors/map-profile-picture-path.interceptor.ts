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
export class MapProfilePictureInterceptor implements NestInterceptor {
  private keysToBeMapped: PropertyKey[];

  constructor(keysToBeMapped: PropertyKey[] = ['profilePicture']) {
    this.keysToBeMapped = keysToBeMapped;
  }

  private mapProfilePicturePath<T = any>(value: T): T {
    const mapped = _.mapValuesDeep(value, (value, key) => {
      if (!this.keysToBeMapped.includes(key) || _.isNil(value)) return value;

      return `${process.env['NX_API_BASE_URL']}${
        process.env['NX_API_SERVER_PREFIX']
          ? `/${process.env['NX_API_SERVER_PREFIX']}`
          : ''
      }/static/${value}`;
    });

    return mapped;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next
      .handle()
      .pipe(map((value) => this.mapProfilePicturePath(value)));
  }
}
