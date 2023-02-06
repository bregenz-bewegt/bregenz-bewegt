import { Global, Module } from '@nestjs/common';
import { MulterService } from '@bregenz-bewegt/server/multer';
import { MulterModule } from '@nestjs/platform-express';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UtilService } from '@bregenz-bewegt/server/util';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '@bregenz-bewegt/server/mail';
import { EmailResetTokenStrategy } from './passport';

@Global()
@Module({
  imports: [MulterModule],
  controllers: [UserController],
  providers: [
    UserService,
    UtilService,
    MulterService,
    JwtService,
    MailService,
    EmailResetTokenStrategy,
  ],
  exports: [UserService],
})
export class UserModule {}
