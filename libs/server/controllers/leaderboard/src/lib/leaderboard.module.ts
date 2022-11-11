import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { PrismaService } from '@bregenz-bewegt/server-prisma';

@Module({
  controllers: [LeaderboardController],
  providers: [LeaderboardService, PrismaService],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}
