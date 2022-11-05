import { GetCurrentUser } from '@bregenz-bewegt/server/common';
import { EndActivityDto, StartActivityDto } from '@bregenz-bewegt/shared/types';
import { Body, Controller, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { ActivityService } from './activity.service';

@Controller('activity')
export class ActivityController {
  constructor(private activityService: ActivityService) {}

  @Post('start')
  startActivity(
    @GetCurrentUser('sub') userId: User['id'],
    @Body() dto: StartActivityDto
  ) {
    return this.activityService.startActivity(userId, dto);
  }

  @Post('end')
  endActivity(@Body() dto: EndActivityDto) {
    return this.activityService.endActivity(dto);
  }
}
