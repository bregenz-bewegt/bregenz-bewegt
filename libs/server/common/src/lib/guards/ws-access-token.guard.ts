import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { JwtPayloadWithRefreshToken } from '@bregenz-bewegt/shared/types';
import { Injectable, CanActivate } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UtilService } from '@bregenz-bewegt/server/util';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WsAccessTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private utilService: UtilService,
    private configService: ConfigService
  ) {}

  canActivate(
    context: any
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const token = this.utilService.extractBearerToken(
      context.args[0].handshake.auth.authorization
    );

    try {
      const decoded: JwtPayloadWithRefreshToken = this.jwtService.verify(
        token,
        { secret: this.configService.get('NX_JWT_ACCESS_TOKEN_SECRET') }
      );
      return new Promise((resolve, reject) => {
        return this.prismaService.user
          .findUnique({ where: { id: decoded.sub } })
          .then((user) => {
            if (user) {
              resolve(user);
            } else {
              reject(false);
            }
          });
      });
    } catch (ex) {
      return false;
    }
  }
}
