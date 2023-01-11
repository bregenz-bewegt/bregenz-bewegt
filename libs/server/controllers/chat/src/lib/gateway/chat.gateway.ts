import { Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  ChatServerToClientEvents,
  ChatClientToServerEvents,
  ChatInterServerEvents,
} from '@bregenz-bewegt/shared/types';
import { PrismaService } from '@bregenz-bewegt/server-prisma';

@Injectable()
@WebSocketGateway({ namespace: 'chats' })
export class ChatGateway {
  constructor(private prismaService: PrismaService) {}

  @WebSocketServer()
  private server: Server = new Server<
    ChatServerToClientEvents,
    ChatClientToServerEvents,
    ChatInterServerEvents
  >();

  @SubscribeMessage('createMessage')
  createMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket
  ): void {
    console.log(data);
  }
}
