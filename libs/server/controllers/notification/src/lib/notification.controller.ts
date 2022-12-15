import {
  GetCurrentUser,
  HasRole,
  RemoveSensitiveFieldsInterceptor,
  RoleGuard,
} from '@bregenz-bewegt/server/common';
import {
  DeleteNotificationDto,
  MarkNotificationAsReadDto,
  MarkNotificationAsUnreadDto,
} from '@bregenz-bewegt/shared/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Role, User, Notification } from '@prisma/client';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @UseInterceptors(new RemoveSensitiveFieldsInterceptor())
  @Get()
  getNotifications(
    @GetCurrentUser('sub') userId: User['id']
  ): Promise<Notification[]> {
    return this.notificationService.getNotifications(userId);
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @UseInterceptors(new RemoveSensitiveFieldsInterceptor())
  @Delete('notification')
  deleteNotification(
    @Body() dto: DeleteNotificationDto
  ): Promise<Notification> {
    return this.notificationService.deleteNotification(dto);
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @UseInterceptors(new RemoveSensitiveFieldsInterceptor())
  @Post('notification/mark-as-read')
  markNotificationAsRead(
    @Body() dto: MarkNotificationAsReadDto
  ): Promise<Notification> {
    return this.notificationService.markNotificationAsRead(dto);
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @UseInterceptors(new RemoveSensitiveFieldsInterceptor())
  @Post('notification/mark-as-unread')
  markNotificationAsUnread(
    @Body() dto: MarkNotificationAsUnreadDto
  ): Promise<Notification> {
    return this.notificationService.markNotificationAsUnread(dto);
  }

  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  @UseInterceptors(new RemoveSensitiveFieldsInterceptor())
  @Post('mark-as-read')
  markAllNotificationsAsRead(
    @GetCurrentUser('sub') userId: User['id']
  ): Promise<void> {
    return this.notificationService.markAllNotificationsAsRead(userId);
  }
}
