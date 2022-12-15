import { DifficultyType } from '../enums';

export type Preferences = {
  id: number;
  difficulties?: DifficultyType[];
  public?: boolean;
};
