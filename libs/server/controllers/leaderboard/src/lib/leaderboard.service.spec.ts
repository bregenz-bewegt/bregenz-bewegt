import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { LeaderboardService } from './leaderboard.service';

describe('LeaderboardService', () => {
  let service: LeaderboardService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LeaderboardService, PrismaService, ConfigService],
    }).compile();

    service = module.get(LeaderboardService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
