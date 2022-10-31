import { PrismaService } from '@bregenz-bewegt/server-prisma';
import {
  Competitor,
  Leaderboard,
  LeaderboardPaginationQueryDto,
  WithCoins,
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
  }: LeaderboardPaginationQueryDto): Promise<Leaderboard> {
    if (skip + take > this.leaderboardLimit) {
      take = 0;
    }

    const users = await this.getRankedUsersWithCoins();

    return users.map((user) => ({
      username: user.username,
      coins: user.coins,
    }));
  }

  async getCompetitor(userId: User['id']): Promise<Competitor> {
    const users = await this.getRankedUsersWithCoins();
    const index = users.findIndex((user) => user.id === userId);
    const competitor = users[index];

    return <Competitor>{
      username: competitor.username,
      coins: competitor.coins,
      rank: index + 1,
    };
  }

  async getRankedUsersWithCoins(): Promise<WithCoins<User>[]> {
    const users = await this.prismaService.user.findMany({
      where: { role: { not: Role.GUEST } },
      include: {
        activities: { select: { exercise: { select: { coins: true } } } },
      },
    });

    return users
      .map((user) => {
        const { activities } = user;

        return {
          ...user,
          coins: activities.reduce((acc, curr) => acc + curr.exercise.coins, 0),
        };
      })
      .sort((a, b) => a.coins - b.coins);
  }
}
