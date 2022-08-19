import {
  UserController,
  UserModule,
  UserService,
} from '@bregenz-bewegt/server-controllers-user';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [UserModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
