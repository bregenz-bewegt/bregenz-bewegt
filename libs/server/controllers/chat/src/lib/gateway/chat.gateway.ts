import { Injectable } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
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
  createMessage(@MessageBody() data: any): void {
    console.log(data);
  }
}
