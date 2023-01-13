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
import { PrismaService } from '@bregenz-bewegt/server-prisma';
import {
  WsAccessTokenGuard,
  WsGetCurrentUser,
} from '@bregenz-bewegt/server/common';

@Injectable()
@WebSocketGateway({ namespace: 'chats' })
export class ChatGateway implements OnGatewayConnection {
  constructor(private prismaService: PrismaService) {}

  @WebSocketServer()
  private server: Server = new Server<
    ChatServerToClientEvents,
    ChatClientToServerEvents,
    ChatInterServerEvents
  >();

  handleConnection(client: Socket): void {
    //
  }

  @UseGuards(WsAccessTokenGuard)
  @SubscribeMessage('message.create')
  createMessage(
    @WsGetCurrentUser() user: any,
    @MessageBody() data: CreateMessageDto,
    @ConnectedSocket()
    socket: Socket
  ): CreateMessageDto {
    const token = socket.handshake.auth.authorization;
    console.log(token, data, user);
    socket.emit('onCreateMessage', data);

    return data;
  }
}
