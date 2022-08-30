import { MulterService } from '@bregenz-bewegt/server/multer';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MulterModule],
  controllers: [UserController],
  providers: [UserService, MulterService],
  exports: [UserService],
})
export class UserModule {}
