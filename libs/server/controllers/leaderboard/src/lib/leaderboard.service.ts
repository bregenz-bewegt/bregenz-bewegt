import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { Competitor } from '@bregenz-bewegt/shared/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LeaderboardService {
  constructor(private prismaService: PrismaService) {}

  async getLeaderboard(): Promise<Competitor[]> {
    return this.prismaService.user.findMany({
      select: { username: true, coins: true },
    });
  }
}
