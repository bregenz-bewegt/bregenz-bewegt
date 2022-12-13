import {
  GetCurrentUser,
  HasRole,
  RemoveSensitiveFieldsInterceptor,
  RoleGuard,
} from '@bregenz-bewegt/server/common';
import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
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
}
