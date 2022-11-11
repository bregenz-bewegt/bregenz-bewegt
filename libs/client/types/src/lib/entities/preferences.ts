import { DifficultyType } from './difficulty';

export type Preferences = {
  id: number;
  difficulties?: DifficultyType[];
  public?: boolean;
};
