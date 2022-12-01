/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { map, Observable } from 'rxjs';

@Injectable()
export class MapUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const mapUser = (value: User) => {
      const {
        password,
        passwordResetToken,
        refreshToken,
        emailResetToken,
        activationSecret,
        fingerprint,
        profilePicture,
        ...rest
      } = value;

      return <User>{
        ...rest,
        ...(profilePicture
          ? {
              profilePicture: `${process.env['NX_API_BASE_URL']}/static/${process.env['NX_UPLOADS_FOLDER']}/profile-pictures/${profilePicture}`,
            }
          : {}),
      };
    };

    return next
      .handle()
      .pipe(
        map((value) =>
          Array.isArray(value)
            ? value.map<User>((item) => mapUser(item))
            : mapUser(value)
        )
      );
  }
}
