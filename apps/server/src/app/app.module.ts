import { AuthModule } from '@bregenz-bewegt/server-controllers-auth';
import { UserModule } from '@bregenz-bewegt/server-controllers-user';
import { PrismaModule } from '@bregenz-bewegt/server-prisma';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [UserModule, AuthModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
