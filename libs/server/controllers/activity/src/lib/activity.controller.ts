import { ActivityPaginationQueryDto } from './../../../../../shared/types/src/lib/dto/activity/activity-pagination.dto';
import { GetCurrentUser } from '@bregenz-bewegt/server/common';
import { EndActivityDto, StartActivityDto } from '@bregenz-bewegt/shared/types';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { Activity, Exercise, Park, User } from '@prisma/client';
import { ActivityService } from './activity.service';

@Controller('activity')
export class ActivityController {
  constructor(private activityService: ActivityService) {}

  @Get()
  getAllByMonth(
    @GetCurrentUser('sub') userId: User['id'],
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      })
    )
    dto: ActivityPaginationQueryDto
  ): Promise<(Activity & { park: Park; exercise: Exercise })[]> {
    return this.activityService.getAll(userId, dto);
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
