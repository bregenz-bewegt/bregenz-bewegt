import { Module } from '@nestjs/common';
import { NotificationGateway } from '@bregenz-bewegt/server/controllers/notification';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';

@Module({
  controllers: [FriendController],
  providers: [FriendService, NotificationGateway],
  exports: [FriendService],
})
export class FriendModule {}
