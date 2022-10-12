import { Competitor } from '@bregenz-bewegt/shared/types';
import { Controller, Get } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @Get()
  getLeaderboard(): Promise<Competitor[]> {
    return this.leaderboardService.getLeaderboard();
  }
}
