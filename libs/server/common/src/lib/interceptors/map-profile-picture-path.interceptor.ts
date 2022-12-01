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
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const mapProfilePicturePath = (
      value: Record<string | number, unknown>
    ): Record<string | number, unknown> => {
      const { profilePicture, ...rest } = value;

      return {
        ...rest,
        ...(profilePicture
          ? {
              profilePicture: `${process.env['NX_API_BASE_URL']}/static/${process.env['NX_UPLOADS_FOLDER']}/${profilePicture}`,
            }
          : {}),
      };
    };

    const mapResponse = (value: any) => {
      if (!_.isPlainObject(value)) return;

      Object.keys(value).forEach((key) => {
        if (!_.isPlainObject(value[key])) return;

        value = mapProfilePicturePath(value);
        mapResponse(value[key]);
      });

      return mapProfilePicturePath(value);
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
