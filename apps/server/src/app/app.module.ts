import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AuthModule } from '@bregenz-bewegt/server-controllers-auth';
import { UserModule } from '@bregenz-bewegt/server-controllers-user';
import { PrismaModule } from '@bregenz-bewegt/server-prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccessTokenGuard } from '@bregenz-bewegt/server/common';
import { ParkModule } from 'libs/server/controllers/park/src';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: path.join(
        __dirname,
        '../../../../',
        process.env['NX_API_UPLOADS_PATH']
      ),
    }),
    UserModule,
    ParkModule,
    AuthModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
