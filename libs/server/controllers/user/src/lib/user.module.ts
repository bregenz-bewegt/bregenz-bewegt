import { CompetitorController } from './competitor.controller';
import { Global, Module } from '@nestjs/common';
import { MulterService } from '@bregenz-bewegt/server/multer';
import { MulterModule } from '@nestjs/platform-express';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UtilService } from '@bregenz-bewegt/server/util';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '@bregenz-bewegt/server/mail';
import { EmailResetTokenStrategy } from './passport';
import { ActivityService } from '@bregenz-bewegt/server/controllers/activity';
import { NotificationGateway } from '@bregenz-bewegt/server/controllers/notification';
import { FriendService } from '@bregenz-bewegt/server/controllers/friend';

@Global()
@Module({
  imports: [MulterModule],
  controllers: [UserController, CompetitorController],
  providers: [
    UserService,
    UtilService,
    MulterService,
    JwtService,
    MailService,
    ActivityService,
    FriendService,
    EmailResetTokenStrategy,
    NotificationGateway,
  ],
  exports: [UserService],
})
export class UserModule {}
