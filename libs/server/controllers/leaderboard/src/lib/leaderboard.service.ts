import { PrismaService } from '@bregenz-bewegt/server-prisma';
import {
  Competitor,
  LeaderboardPaginationQueryDto,
} from '@bregenz-bewegt/shared/types';
import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class LeaderboardService {
  constructor(private prismaService: PrismaService) {}

  async getLeaderboard({
    skip,
    take,
  }: LeaderboardPaginationQueryDto): Promise<Competitor[]> {
    return this.prismaService.user.findMany({
      skip,
      take,
      where: { role: { not: Role.GUEST } },
      select: { username: true, coins: true },
      orderBy: { coins: 'desc' },
    });
  }
}
