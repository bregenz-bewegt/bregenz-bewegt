import { Activity } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class EndActivityDto {
  @IsString()
  @IsNotEmpty()
  activityId: Activity['id'];
}
