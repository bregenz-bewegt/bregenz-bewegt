import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { JwtPayloadWithRefreshToken } from '@bregenz-bewegt/shared/types';
import { Injectable, CanActivate } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class WsAccessTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService
  ) {}

  canActivate(
    context: any
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const token = context.args[0].handshake.headers.authorization
      .replace('Bearer', '')
      .trim();
    try {
      const decoded: JwtPayloadWithRefreshToken = this.jwtService.verify(token);
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
      console.log(ex);
      return false;
    }
  }
}
