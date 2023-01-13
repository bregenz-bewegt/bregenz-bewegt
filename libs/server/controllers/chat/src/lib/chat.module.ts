import { UtilService } from '@bregenz-bewegt/server/util';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './gateway';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, JwtService, UtilService],
  exports: [ChatService],
})
export class ChatModule {}
