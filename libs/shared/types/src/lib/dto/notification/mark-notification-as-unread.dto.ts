import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Notification } from '@bregenz-bewegt/client/types';

export class MarkNotificationAsUnreadDto {
  @ApiProperty()
  @IsString()
  notificationId: Notification['id'];
}
