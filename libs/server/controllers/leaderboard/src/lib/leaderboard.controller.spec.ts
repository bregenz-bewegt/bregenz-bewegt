import { Test } from '@nestjs/testing';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { PrismaService } from '@bregenz-bewegt/server-prisma';
import { ConfigService } from '@nestjs/config';

describe('ServerControllersLeaderboardController', () => {
  let controller: LeaderboardController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LeaderboardService, PrismaService, ConfigService],
      controllers: [LeaderboardController],
    }).compile();

    controller = module.get(LeaderboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
