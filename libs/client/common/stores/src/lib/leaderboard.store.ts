import { http } from '@bregenz-bewegt/client/common/http';
import { Competitor } from '@bregenz-bewegt/shared/types';
import { Store } from './store';

export class LeaderboardStore implements Store {
  storeKey = 'leaderboardStore' as const;

  async fetch(): Promise<Competitor[]> {
    const { data } = await http.get('/leaderboard');
    return data;
  }
}

export const leaderboardStore = new LeaderboardStore();
