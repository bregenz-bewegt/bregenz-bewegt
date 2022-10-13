import { http } from '@bregenz-bewegt/client/common/http';
import {
  Competitor,
  LeaderboardPaginationQueryDto,
} from '@bregenz-bewegt/shared/types';
import { Store } from './store';

export class LeaderboardStore implements Store {
  storeKey = 'leaderboardStore' as const;

  async fetch(params: LeaderboardPaginationQueryDto): Promise<Competitor[]> {
    const { data } = await http.get(`/leaderboard`, { params });
    return data;
  }
}

export const leaderboardStore = new LeaderboardStore();