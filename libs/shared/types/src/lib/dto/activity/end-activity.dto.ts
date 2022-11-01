import { ApiProperty } from '@nestjs/swagger';
import { Activity } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class EndActivityDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  activityId: Activity['id'];
}
