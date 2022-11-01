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

  async getLeaderboard(
    userId: User['id'],
    { skip, take }: LeaderboardPaginationQueryDto
  ): Promise<Leaderboard> {
    if (skip + take > this.leaderboardLimit) {
      take = 0;
    }

    const users = await this.getRankedUsersWithCoins(userId, { skip, take });

    return users.map((user) => ({
      username: user.username,
      coins: user.coins,
    }));
  }

  async getCompetitor(userId: User['id']): Promise<Competitor> {
    const users = await this.getRankedUsersWithCoins(userId);
    const index = users.findIndex((user) => user.id === userId);
    const competitor = users[index];

    return <Competitor>{
      username: competitor.username,
      coins: competitor.coins,
      rank: index + 1,
    };
  }

  async getRankedUsersWithCoins(
    userId: User['id'],
    options?: {
      skip?: number;
      take?: number;
    }
  ): Promise<WithCoins<User>[]> {
    const users = await this.prismaService.user.findMany({
      where: {
        OR: [
          { id: userId },
          {
            AND: [
              {
                role: { not: Role.GUEST },
              },
              {
                preferences: { public: true },
              },
            ],
          },
        ],
      },
      include: {
        activities: { select: { exercise: { select: { coins: true } } } },
      },
      ...(options?.skip !== undefined ? { skip: options.skip } : {}),
      ...(options?.skip !== undefined ? { take: options.take } : {}),
    });

    return users
      .map((user) => {
        const { activities, ...rest } = user;

        return {
          ...rest,
          coins: activities.reduce((acc, curr) => acc + curr.exercise.coins, 0),
        };
      })
      .sort((a, b) => b.coins - a.coins);
  }
}
