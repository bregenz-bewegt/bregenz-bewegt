/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import * as _ from 'lodash';

@Injectable()
export class RemoveSensitiveFieldsInterceptor implements NestInterceptor {
  private isPlainObjectOrArray(value: any): boolean {
    return _.isPlainObject(value) || _.isArray(value);
  }

  private removeSensitiveFields(
    value: Record<string | number, unknown>
  ): Record<string | number, unknown> {
    const {
      password,
      passwordResetToken,
      refreshToken,
      emailResetToken,
      activationSecret,
      fingerprint,
      ...rest
    } = value;

    return {
      ...rest,
    };
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const mapResponse = (value: any) => {
      if (!this.isPlainObjectOrArray(value)) return;

      Object.keys(value).forEach((key) => {
        if (!this.isPlainObjectOrArray(value[key])) return;

        value = this.removeSensitiveFields(value);
        mapResponse(value[key]);
      });

      return this.removeSensitiveFields(value);
    };

    return next
      .handle()
      .pipe(
        map((value) =>
          Array.isArray(value)
            ? value.map((item) => mapResponse(item))
            : mapResponse(value)
        )
      );
  }
}
