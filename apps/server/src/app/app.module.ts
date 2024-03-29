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
import { ParkModule } from '@bregenz-bewegt/server/controllers/park';
import { FriendModule } from '@bregenz-bewegt/server/controllers/friend';
import { NotificationModule } from '@bregenz-bewegt/server/controllers/notification';
import { ChatModule } from '@bregenz-bewegt/server/controllers/chat';

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
        dir: __dirname + '/assets/mail/templates',
        adapter: new HandlebarsAdapter(undefined, {
          inlineCssEnabled: false,
          inlineCssOptions: {
            url: ' ',
            preserveMediaQueries: true,
          },
        }),
        options: {
          strict: true,
        },
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'static'),
      serveRoot: `/${process.env['NX_API_SERVER_PREFIX'] ?? ''}/static`,
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
    FriendModule,
    NotificationModule,
    ChatModule,
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
