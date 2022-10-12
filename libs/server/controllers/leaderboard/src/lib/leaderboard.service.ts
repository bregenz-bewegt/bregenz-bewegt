import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { Competitor } from '@bregenz-bewegt/shared/types';
import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class LeaderboardService {
  constructor(private prismaService: PrismaService) {}

  async getLeaderboard(): Promise<Competitor[]> {
    return this.prismaService.user.findMany({
      where: { role: { not: Role.GUEST } },
      select: { username: true, coins: true },
      orderBy: { coins: 'desc' },
    });
  }
}
