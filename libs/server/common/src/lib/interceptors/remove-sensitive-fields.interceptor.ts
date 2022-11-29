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
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const removeSensitiveFields = (value: any): any => {
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
    };

    const mapResponse = (value: any) => {
      if (!_.isPlainObject(value)) return;

      Object.keys(value).forEach((key) => {
        if (!_.isPlainObject(value[key])) return;

        value = removeSensitiveFields(value);
        mapResponse(value[key]);
      });

      return removeSensitiveFields(value);
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
