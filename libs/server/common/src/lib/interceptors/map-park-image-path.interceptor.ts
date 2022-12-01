import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import * as _ from 'lodash';

@Injectable()
export class MapParkImagePathInterceptor implements NestInterceptor {
  private isPlainObjectOrArray(value: any): boolean {
    return _.isPlainObject(value) || _.isArray(value);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const mapImagePath = (
      value: Record<string | number, unknown>
    ): Record<string | number, unknown> => {
      const { image, ...rest } = value;

      return {
        ...rest,
        ...(image
          ? {
              image: `${process.env['NX_API_BASE_URL']}/static/${image}`,
            }
          : {}),
      };
    };

    const mapResponse = (value: any) => {
      if (!this.isPlainObjectOrArray(value)) return;

      Object.keys(value).forEach((key) => {
        if (!this.isPlainObjectOrArray(value[key])) return;

        value = mapImagePath(value);
        mapResponse(value[key]);
      });

      return mapImagePath(value);
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
