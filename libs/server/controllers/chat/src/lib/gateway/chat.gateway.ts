import { Injectable, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  ChatServerToClientEvents,
  ChatClientToServerEvents,
  ChatInterServerEvents,
  CreateMessageDto,
} from '@bregenz-bewegt/shared/types';
import {
  WsAccessTokenGuard,
  WsGetCurrentUser,
} from '@bregenz-bewegt/server/common';
import { User } from '@prisma/client';
import { ChatService } from '../chat.service';

@Injectable()
@WebSocketGateway({ namespace: 'chats' })
export class ChatGateway implements OnGatewayConnection {
  constructor(private chatService: ChatService) {}

  @WebSocketServer()
  private server: Server = new Server<
    ChatServerToClientEvents,
    ChatClientToServerEvents,
    ChatInterServerEvents
  >();

  handleConnection(): void {
    //
  }

  @UseGuards(WsAccessTokenGuard)
  @SubscribeMessage('message.create')
  async createMessage(
    @WsGetCurrentUser('sub') userId: User['id'],
    @MessageBody() dto: CreateMessageDto,
    @ConnectedSocket()
    socket: Socket
  ): Promise<CreateMessageDto> {
    const conversation = await this.chatService.createMessage(userId, dto);

    conversation.participants.forEach((partifipant) => {
      socket.to(partifipant.conversationSocketId).emit('onCreateMessage', dto);
    });

    return dto;
  }
}
