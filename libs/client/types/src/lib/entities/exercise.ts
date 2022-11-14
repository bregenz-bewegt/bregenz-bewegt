import { DifficultyType } from './difficulty';

export type Exercise = {
  id: number;
  name: string;
  description: string;
  video: string;
  coins: number;
  difficulty: DifficultyType;
};
