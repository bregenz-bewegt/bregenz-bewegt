/* eslint-disable @typescript-eslint/no-unused-vars */
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
export class RemoveSensitiveFieldsInterceptor implements NestInterceptor {
  private sensitiveFields: (string | number)[] = [
    'password',
    'passwordResetToken',
    'refreshToken',
    'emailResetToken',
    'activationSecret',
    'fingerprint',
    'notificationSocketId',
  ];

  private removeSensitiveFields<T = any>(value: T): T {
    const mapped = _.eachDeep(value, (value, key, parent, ctx) => {
      if (!this.sensitiveFields.includes(key)) return true;

      parent && delete parent[key];
      return false;
    });

    return mapped;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next
      .handle()
      .pipe(map((value) => this.removeSensitiveFields(value)));
  }
}
