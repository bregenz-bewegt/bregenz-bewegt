import {
  GetCurrentUser,
  HasRole,
  RoleGuard,
} from '@bregenz-bewegt/server/common';
import {
  Competitor,
  Leaderboard,
  LeaderboardPaginationQueryDto,
} from '@bregenz-bewegt/shared/types';
import {
  Controller,
  Get,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @Get()
  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  getLeaderboard(
    @GetCurrentUser('sub') userId: User['id'],
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      })
    )
    dto: LeaderboardPaginationQueryDto
  ): Promise<Leaderboard> {
    return this.leaderboardService.getLeaderboard(userId, dto);
  }

  @Get('competitor')
  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  getCompetitor(
    @GetCurrentUser('sub') userId: User['id']
  ): Promise<Competitor> {
    return this.leaderboardService.getCompetitor(userId);
  }
}
