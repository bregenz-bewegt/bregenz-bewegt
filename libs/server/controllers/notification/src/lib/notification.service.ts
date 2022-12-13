import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { Injectable } from '@nestjs/common';
import { User, Notification } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private prismaService: PrismaService) {}

  async getNotifications(userId: User['id']): Promise<Notification[]> {
    const { notifications } = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { notifications: true },
    });

    return notifications;
  }
}
