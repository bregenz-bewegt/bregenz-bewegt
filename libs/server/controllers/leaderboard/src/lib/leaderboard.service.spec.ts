import { Test } from '@nestjs/testing';
import { LeaderboardService } from './leaderboard.service';

describe('LeaderboardService', () => {
  let service: LeaderboardService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LeaderboardService],
    }).compile();

    service = module.get(LeaderboardService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
