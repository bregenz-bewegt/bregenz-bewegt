import { PrismaService } from '@bregenz-bewegt/server-prisma';
import {
  Competitor,
  LeaderboardPaginationQueryDto,
} from '@bregenz-bewegt/shared/types';
import { Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';

@Injectable()
export class LeaderboardService {
  private leaderboardLimit = 100;
  constructor(private prismaService: PrismaService) {}

  async getLeaderboard({
    skip,
    take,
  }: LeaderboardPaginationQueryDto): Promise<Competitor[]> {
    if (skip + take > this.leaderboardLimit) {
      take = 0;
    }

    return this.prismaService.user.findMany({
      where: { role: { not: Role.GUEST } },
      select: { username: true, coins: true },
      orderBy: { coins: 'desc' },
      skip,
      take,
    });
  }

  async getCompetitor(userId: User['id']): Promise<Competitor> {
    const leaderboard: User[] = await this.prismaService.user.findMany({
      where: { role: { not: Role.GUEST } },
      orderBy: { coins: 'desc' },
    });
    const index = leaderboard.findIndex((user) => user.id === userId);
    const competitor = leaderboard[index];

    return <Competitor>{
      username: competitor.username,
      coins: competitor.coins,
      rank: index + 1,
    };
  }
}
