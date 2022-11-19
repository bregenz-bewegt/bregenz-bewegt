import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { AuthModule } from '@bregenz-bewegt/server-controllers-auth';
import { UserModule } from '@bregenz-bewegt/server-controllers-user';
import { PrismaModule } from '@bregenz-bewegt/server-prisma';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccessTokenGuard, RoleGuard } from '@bregenz-bewegt/server/common';
import { MulterModule } from '@bregenz-bewegt/server/multer';
import { ExerciseModule } from '@bregenz-bewegt/server/controllers/exercise';
import { MailModule } from '@bregenz-bewegt/server/mail';
import { UtilModule } from '@bregenz-bewegt/server/util';
import { MailerModule } from '@nestjs-modules/mailer';
import { LeaderboardModule } from '@bregenz-bewegt/server/controllers/leaderboard';
import { ActivityModule } from '@bregenz-bewegt/server/controllers/activity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot({
      transport: {
        host: process.env['NX_MAIL_HOST'],
        port: +process.env['NX_MAIL_PORT'],
        secure: true,
        auth: {
          user: process.env['NX_MAIL_AUTH_USER'],
          pass: process.env['NX_MAIL_AUTH_PASS'],
        },
      },
      defaults: {
        from: process.env['NX_MAIL_FROM'],
      },
      template: {
        dir: './templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
      preview: true, // only for testing
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'static'),
      serveRoot: '/static',
      serveStaticOptions: {
        redirect: false,
        index: false,
      },
    }),
    MailModule,
    PrismaModule,
    MulterModule,
    AuthModule,
    UtilModule,
    UserModule,
    ParkModule,
    LeaderboardModule,
    ExerciseModule,
    ActivityModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
