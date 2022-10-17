import { Controller, Post } from '@nestjs/common';
import { ActivityService } from './activity.service';

@Controller('activity')
export class ActivityController {
  constructor(private activityService: ActivityService) {}

  @Post('start')
  startActivity() {
    this.activityService.startActivity();
  }

  @Post('end')
  endActivity() {
    this.activityService.endActivity();
  }
}
