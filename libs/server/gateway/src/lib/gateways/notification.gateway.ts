import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
} from '@bregenz-bewegt/shared/types';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Notification } from '@prisma/client';

@Injectable()
@WebSocketGateway({
  path: 'api/notification-gateway',
})
export class NotificationGateway implements OnModuleInit {
  @WebSocketServer()
  private server: Server = new Server<
    ServerToClientEvents,
    ClientToServerEvents,
    InterServerEvents
  >();

  onModuleInit(): void {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
    });
  }

  emitNotification(notification: Notification): void {
    this.server.emit('receiveNotification', notification);
  }
}
