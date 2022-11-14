import { GetCurrentUser } from '@bregenz-bewegt/server/common';
import { EndActivityDto, StartActivityDto } from '@bregenz-bewegt/shared/types';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Activity, Exercise, Park, User } from '@prisma/client';
import { ActivityService } from './activity.service';

@Controller('activity')
export class ActivityController {
  constructor(private activityService: ActivityService) {}

  @Get(':month')
  getAllByMonth(
    @GetCurrentUser('sub') userId: User['id'],
    @Param('month', ParseIntPipe) month: number
  ): Promise<(Activity & { park: Park; exercise: Exercise })[]> {
    return this.activityService.findAllInMonth(userId, month);
  }

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
