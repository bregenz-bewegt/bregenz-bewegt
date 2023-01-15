import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { JwtPayloadWithRefreshToken } from '@bregenz-bewegt/shared/types';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UtilService } from '@bregenz-bewegt/server/util';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';

@Injectable()
export class WsAccessTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private utilService: UtilService,
    private configService: ConfigService
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token = this.utilService.extractBearerToken(
      client.handshake.auth.authorization
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
              context.switchToHttp().getRequest().user = decoded;
              resolve(user);
            } else {
              reject(false);
            }
          });
      });
    } catch (ex) {
      client.emit('onUnauthorized');
      return false;
    }
  }
}
