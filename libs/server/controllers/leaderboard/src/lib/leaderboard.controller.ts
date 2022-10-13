import {
  Competitor,
  LeaderboardPaginationQueryDto,
} from '@bregenz-bewegt/shared/types';
import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @Get()
  getLeaderboard(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      })
    )
    dto: LeaderboardPaginationQueryDto
  ): Promise<Competitor[]> {
    return this.leaderboardService.getLeaderboard(dto);
  }
}
