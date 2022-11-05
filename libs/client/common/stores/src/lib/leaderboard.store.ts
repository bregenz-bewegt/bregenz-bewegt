import { http } from '@bregenz-bewegt/client/common/http';
import {
  Competitor,
  GetCompetitorDto,
  Leaderboard,
  LeaderboardFilterTimespans,
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

  async getCompetitor(params: GetCompetitorDto): Promise<Competitor> {
    const { data } = await http.get(`/leaderboard/competitor`, { params });
    return <Competitor>data;
  }

  async getFilterTimespans(): Promise<LeaderboardFilterTimespans> {
    const { data } = await http.get(`/leaderboard/filter-timespans`);
    return <LeaderboardFilterTimespans>data;
  }
}

export const leaderboardStore = new LeaderboardStore();
