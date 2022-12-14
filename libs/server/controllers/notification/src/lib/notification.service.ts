import { PrismaService } from '@bregenz-bewegt/server-prisma';
import {
  DeleteNotificationDto,
  MarkNotificationAsReadDto,
  MarkNotificationAsUnreadDto,
} from '@bregenz-bewegt/shared/types';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User, Notification } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private prismaService: PrismaService) {}

  async getNotifications(userId: User['id']): Promise<Notification[]> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { notifications: { orderBy: { createdAt: 'desc' } } },
    });

    return user?.notifications ?? [];
  }

  async deleteNotification(dto: DeleteNotificationDto): Promise<Notification> {
    const exists = await this.prismaService.notification.findUnique({
      where: { id: dto.notificationId },
    });

    if (!exists) throw new NotFoundException();

    return this.prismaService.notification.delete({
      where: { id: dto.notificationId },
    });
  }

  async markNotificationAsRead(
    dto: MarkNotificationAsReadDto
  ): Promise<Notification> {
    const exists = await this.prismaService.notification.findUnique({
      where: { id: dto.notificationId },
    });

    if (!exists) throw new NotFoundException();

    return this.prismaService.notification.update({
      where: { id: dto.notificationId },
      data: { read: true },
    });
  }

  async markNotificationAsUnread(
    dto: MarkNotificationAsUnreadDto
  ): Promise<Notification> {
    const exists = await this.prismaService.notification.findUnique({
      where: { id: dto.notificationId },
    });

    if (!exists) throw new NotFoundException();

    return this.prismaService.notification.update({
      where: { id: dto.notificationId },
      data: { read: false },
    });
  }

  async markAllNotificationsAsRead(
    userId: User['id']
  ): Promise<Notification[]> {
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        notifications: {
          updateMany: { where: { NOT: null }, data: { read: true } },
        },
      },
      include: { notifications: true },
    });

    return user?.notifications ?? [];
  }
}
