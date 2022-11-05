import { Test } from '@nestjs/testing';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';

describe('ServerControllersLeaderboardController', () => {
  let controller: LeaderboardController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LeaderboardService],
      controllers: [LeaderboardController],
    }).compile();

    controller = module.get(LeaderboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
