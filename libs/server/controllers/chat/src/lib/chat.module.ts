import { UserModule } from '@bregenz-bewegt/server-controllers-user';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './gateway';

@Module({
  imports: [JwtModule, UserModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, JwtService],
  exports: [ChatService],
})
export class ChatModule {}
