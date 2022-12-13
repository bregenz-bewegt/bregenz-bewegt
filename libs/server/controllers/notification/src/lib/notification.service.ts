import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { MarkNotificationAsReadDto } from '@bregenz-bewegt/shared/types';
import { Injectable } from '@nestjs/common';
import { User, Notification } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private prismaService: PrismaService) {}

  async getNotifications(userId: User['id']): Promise<Notification[]> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { notifications: { orderBy: { read: 'asc' } } },
    });

    return user?.notifications;
  }

  async markNotificationAsRead(
    dto: MarkNotificationAsReadDto
  ): Promise<Notification> {
    return this.prismaService.notification.update({
      where: { id: dto.notificationId },
      data: { read: true },
    });
  }
}
