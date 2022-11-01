import { Activity } from '@prisma/client';
import { IsString } from 'class-validator';

export class EndActivityDto {
  @IsString()
  activityId: Activity['id'];
}
