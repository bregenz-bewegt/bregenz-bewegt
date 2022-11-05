import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class RemoveSensitiveFieldsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((value) =>
        Array.isArray(value)
          ? value.map((item) => ({
              ...item,
              password: undefined,
              refreshToken: undefined,
              passwordResetToken: undefined,
              activationSecret: undefined,
            }))
          : {
              ...value,
              password: undefined,
              refreshToken: undefined,
              passwordResetToken: undefined,
              activationSecret: undefined,
            }
      )
    );
  }
}
