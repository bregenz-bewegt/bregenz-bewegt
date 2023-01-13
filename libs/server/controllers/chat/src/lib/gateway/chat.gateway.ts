import { Injectable } from '@nestjs/common';
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

  handleConnection(x: any): void {
    console.log(x);
  }

  @SubscribeMessage('createMessage')
  createMessage(
    @MessageBody() data: CreateMessageDto,
    @ConnectedSocket()
    client: Socket
  ): CreateMessageDto {
    console.log(data);
    client.emit('onCreateMessage', data);
    return data;
  }
}
