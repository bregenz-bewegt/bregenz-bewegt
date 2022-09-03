import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from '@bregenz-bewegt/server-controllers-auth';
import { UserModule } from '@bregenz-bewegt/server-controllers-user';
import { PrismaModule } from '@bregenz-bewegt/server-prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccessTokenGuard } from '@bregenz-bewegt/server/common';
import { ParkModule } from 'libs/server/controllers/park/src';
import { MulterModule } from '@bregenz-bewegt/server/multer';
import { ExerciseModule } from '@bregenz-bewegt/server/controllers/exercise';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    ParkModule,
    ExerciseModule,
    AuthModule,
    PrismaModule,
    MulterModule,
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
