import { Module } from '@nestjs/common';
import { NotificationGateway } from 'libs/server/gateway/src/lib/gateways';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';

@Module({
  controllers: [FriendController],
  providers: [FriendService, NotificationGateway],
  exports: [FriendService],
})
export class FriendModule {}
