import { Leaderboard } from './leaderboard';

export type Competitor = (Leaderboard extends readonly (infer T)[]
  ? T
  : never) & {
  rank: number;
};
