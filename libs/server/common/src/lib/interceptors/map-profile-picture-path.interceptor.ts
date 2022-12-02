import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import * as _ from 'lodash';

@Injectable()
export class MapProfilePictureInterceptor implements NestInterceptor {
  private isPlainObjectOrArray(value: any): boolean {
    return _.isPlainObject(value) || _.isArray(value);
  }

  private mapProfilePicturePath(
    value: Record<string | number, unknown>
  ): Record<string | number, unknown> {
    const { profilePicture, ...rest } = value;

    return {
      ...rest,
      ...(profilePicture
        ? {
            profilePicture: `${process.env['NX_API_BASE_URL']}/static/${process.env['NX_UPLOADS_FOLDER']}/profile-pictures/${profilePicture}`,
          }
        : {}),
    };
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const mapResponse = (value: any) => {
      if (!this.isPlainObjectOrArray(value)) return;

      Object.keys(value).forEach((key) => {
        if (!this.isPlainObjectOrArray(value[key])) return;

        value = this.mapProfilePicturePath(value);
        mapResponse(value[key]);
      });

      return this.mapProfilePicturePath(value);
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
