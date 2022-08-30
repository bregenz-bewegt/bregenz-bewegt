import { Difficulty } from './difficulty';

export type Exercise = {
  id: number;
  name: string;
  description: string;
  video: string;
  points: number;
  difficulty: Difficulty;
};
