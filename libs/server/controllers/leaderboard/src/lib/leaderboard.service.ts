import { PrismaService } from '@bregenz-bewegt/server-prisma';
import {
  Competitor,
  GetCompetitorDto,
  Leaderboard,
  LeaderboardFilterTimespans,
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
    { skip, take, year }: LeaderboardPaginationQueryDto
  ): Promise<Leaderboard> {
    if (skip + take > this.leaderboardLimit) {
      take = 0;
    }

    const users = await this.getRankedUsersWithCoins(userId, {
      skip,
      take,
      year,
    });

    return users.map((user) => ({
      username: user.username,
      coins: user.coins,
    }));
  }

  async getCompetitor(
    userId: User['id'],
    { year }: GetCompetitorDto
  ): Promise<Competitor> {
    const users = await this.getRankedUsersWithCoins(userId, { year });
    const index = users.findIndex((user) => user.id === userId);
    const competitor = users[index];

    return <Competitor>{
      username: competitor.username,
      coins: competitor.coins,
      rank: index + 1,
    };
  }

  async getFilterTimespans(): Promise<LeaderboardFilterTimespans> {
    const { _min, _max } = await this.prismaService.activity.aggregate({
      _min: { endedAt: true },
      _max: { endedAt: true },
    });

    const range = [_max.endedAt.getFullYear(), _min.endedAt.getFullYear()];
    const diff = range[0] - range[1];
    const timespans =
      diff > 1
        ? [
            range[0],
            ...Array(diff)
              .fill(null)
              .map((_, i) => range[0] - (i + 1)),
          ]
        : [...new Set(range)];

    return timespans;
  }

  async getRankedUsersWithCoins(
    userId: User['id'],
    options?: {
      skip?: number;
      take?: number;
      year?: number;
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
        activities: {
          ...(options?.year !== undefined
            ? {
                where: {
                  AND: [
                    {
                      endedAt: { gte: new Date(options.year, 0, 1) },
                    },
                    {
                      endedAt: { lte: new Date(options.year, 11, 31) },
                    },
                  ],
                },
              }
            : { where: { NOT: { endedAt: null } } }),
          select: { exercise: { select: { coins: true } } },
        },
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
