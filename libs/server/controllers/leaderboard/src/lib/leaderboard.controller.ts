import {
  Competitor,
  LeaderboardPaginationDto,
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
    dto: LeaderboardPaginationDto
  ): Promise<Competitor[]> {
    console.log(dto);
    return this.leaderboardService.getLeaderboard(dto);
  }
}
