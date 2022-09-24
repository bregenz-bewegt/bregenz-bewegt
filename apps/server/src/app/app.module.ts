import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { AuthModule } from '@bregenz-bewegt/server-controllers-auth';
import { UserModule } from '@bregenz-bewegt/server-controllers-user';
import { PrismaModule } from '@bregenz-bewegt/server-prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccessTokenGuard, RoleGuard } from '@bregenz-bewegt/server/common';
import { ParkModule } from 'libs/server/controllers/park/src';
import { MulterModule } from '@bregenz-bewegt/server/multer';
import { ExerciseModule } from '@bregenz-bewegt/server/controllers/exercise';
import { MailModule } from '@bregenz-bewegt/server/mail';
import { UtilModule } from '@bregenz-bewegt/server/util';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailModule,
    PrismaModule,
    MulterModule,
    AuthModule,
    UtilModule,
    UserModule,
    ParkModule,
    ExerciseModule,
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
