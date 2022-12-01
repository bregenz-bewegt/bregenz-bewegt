import {
  GetCurrentUser,
  HasRole,
  MapProfilePictureInterceptor,
  RoleGuard,
} from '@bregenz-bewegt/server/common';
import {
  Competitor,
  GetCompetitorDto,
  Leaderboard,
  LeaderboardFilterTimespans,
  LeaderboardPaginationQueryDto,
} from '@bregenz-bewegt/shared/types';
import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
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
  @UseInterceptors(MapProfilePictureInterceptor)
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

  @UseInterceptors(MapProfilePictureInterceptor)
  @Get('competitor')
  getCompetitor(
    @GetCurrentUser('sub') userId: User['id'],
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      })
    )
    dto: GetCompetitorDto
  ): Promise<Competitor> {
    return this.leaderboardService.getCompetitor(userId, dto);
  }

  @Get('filter-timespans')
  @HasRole(Role.USER)
  @UseGuards(RoleGuard)
  getFilterableTimespans(): Promise<LeaderboardFilterTimespans> {
    return this.leaderboardService.getFilterTimespans();
  }
}
