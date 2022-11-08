import { Module } from '@nestjs/common';
import { MulterService } from '@bregenz-bewegt/server/multer';
import { MulterModule } from '@nestjs/platform-express';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UtilService } from '@bregenz-bewegt/server/util';

@Module({
  imports: [MulterModule],
  controllers: [UserController],
  providers: [UserService, UtilService, MulterService],
  exports: [UserService],
})
export class UserModule {}
