import { http } from '@bregenz-bewegt/client/common/http';
import {
  Competitor,
  Leaderboard,
  LeaderboardPaginationQueryDto,
} from '@bregenz-bewegt/shared/types';
import { Store } from './store';

export class LeaderboardStore implements Store {
  storeKey = 'leaderboardStore' as const;

  async getLeaderboard(
    params: LeaderboardPaginationQueryDto
  ): Promise<Leaderboard> {
    const { data } = await http.get(`/leaderboard`, { params });
    return <Leaderboard>data;
  }

  async getCompetitor(): Promise<Competitor> {
    const { data } = await http.get(`/leaderboard/competitor`);
    return <Competitor>data;
  }
}

export const leaderboardStore = new LeaderboardStore();
