import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
} from '@bregenz-bewegt/shared/types';
import { Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Notification, Role } from '@prisma/client';
import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { User } from '@prisma/client';

@Injectable()
@WebSocketGateway()
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private prismaService: PrismaService) {}

  @WebSocketServer()
  private server: Server = new Server<
    ServerToClientEvents,
    ClientToServerEvents,
    InterServerEvents
  >();

  async handleConnection(client: Socket): Promise<User> {
    const userId = client.handshake?.auth?.authorization;
    if (!userId) return;

    console.log(userId);
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user || user.role === Role.GUEST) return;

    return this.prismaService.user.update({
      where: { id: user.id },
      data: { notificationSocketId: client.id },
    });
  }

  handleDisconnect(client: Socket): void {
    console.log('disconnect');
  }

  async emitNotification(notification: Notification): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: { id: notification.userId },
    });
    if (!user) return;

    return this.server
      .to(user.notificationSocketId)
      .emit('receiveNotification', notification);
  }
}
