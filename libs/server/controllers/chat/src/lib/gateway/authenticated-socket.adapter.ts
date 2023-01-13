import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Socket, Server, ServerOptions } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UtilService } from '@bregenz-bewegt/server/util';
import {
  ChatClientToServerEvents,
  ChatInterServerEvents,
  ChatServerToClientEvents,
} from '@bregenz-bewegt/shared/types';
import { PrismaService } from '@bregenz-bewegt/server-prisma';

export class AuthenticatedSocketAdapter extends IoAdapter {
  private jwtService: JwtService;
  private configService: ConfigService;
  private utilService: UtilService;
  private prismaService: PrismaService;

  constructor(private app: INestApplicationContext) {
    super(app);
    // app.resolve<JwtService>(JwtService).then((jwtService) => {
    //   this.jwtService = jwtService;
    // });
    this.jwtService = app.get(JwtService);
    this.configService = app.get(ConfigService);
    this.utilService = app.get(UtilService);
    this.prismaService = app.get(PrismaService);
  }

  createIOServer(
    port: number,
    options?: ServerOptions
  ): Server<
    ChatClientToServerEvents,
    ChatServerToClientEvents,
    ChatInterServerEvents
  > {
    const server: Server<
      ChatClientToServerEvents,
      ChatServerToClientEvents,
      ChatInterServerEvents
    > = super.createIOServer(port, {
      ...options,
      cors: true,
    });

    server.use(async (socket: Socket, next) => {
      const token = this.utilService.extractBearerToken(
        socket.handshake.auth.authorization
      );
      console.log(token);

      if (!token) {
        return next(new Error('Token not provided'));
      }

      try {
        const decoded = await this.jwtService.verify(token, {
          secret: this.configService.get('NX_JWT_ACCESS_TOKEN_SECRET'),
        });

        const user = await this.prismaService.user.findUnique({
          where: { id: decoded.sub },
        });

        if (user) (socket as Socket & { user: any }).user = user;
        return next();
      } catch (error: any) {
        return next(new Error('Authentication error'));
      }
    });

    return server;
  }
}
