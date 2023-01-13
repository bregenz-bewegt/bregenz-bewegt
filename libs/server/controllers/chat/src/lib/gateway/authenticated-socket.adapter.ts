import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UtilService } from '@bregenz-bewegt/server/util';

export class AuthenticatedSocketAdapter extends IoAdapter {
  private jwtService: JwtService;
  private configService: ConfigService;
  private utilService: UtilService;

  constructor(private app: INestApplicationContext) {
    super(app);
    // app.resolve<JwtService>(JwtService).then((jwtService) => {
    //   this.jwtService = jwtService;
    // });
    this.jwtService = app.get(JwtService);
    this.configService = app.get(ConfigService);
    this.utilService = app.get(UtilService);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    options.allowRequest = async (request, allowFunction) => {
      console.log(request.headers.authorization);
      const token = this.utilService.extractBearerToken(
        request.headers.authorization
      );

      //   const verified = this.jwtService.verify(token);
      //   if (verified) {
      //     return allowFunction(null, true);
      //   }

      //   return allowFunction('Unauthorized', false);
    };

    return super.createIOServer(port, { ...options, cors: true });
  }
}
