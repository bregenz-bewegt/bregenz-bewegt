import { PrismaService } from '@bregenz-bewegt/server-prisma';
import {
  DeleteNotificationDto,
  MarkNotificationAsReadDto,
} from '@bregenz-bewegt/shared/types';
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

  async deleteNotification(dto: DeleteNotificationDto): Promise<Notification> {
    const exists = await this.prismaService.notification.findUnique({
      where: { id: dto.notificationId },
    });

    if (!exists) return;

    return this.prismaService.notification.delete({
      where: { id: dto.notificationId },
    });
  }
}
