import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
} from '@bregenz-bewegt/shared/types';
import { Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Notification } from '@prisma/client';
import { PrismaService } from '@bregenz-bewegt/server-prisma';

@Injectable()
@WebSocketGateway()
export class NotificationGateway implements OnGatewayConnection {
  constructor(private prismaService: PrismaService) {}

  @WebSocketServer()
  private server: Server = new Server<
    ServerToClientEvents,
    ClientToServerEvents,
    InterServerEvents
  >();

  handleConnection(client: Socket): void {
    console.log(client.handshake.auth);
  }

  emitNotification(notification: Notification): void {
    this.server.emit('receiveNotification', notification);
  }
}
