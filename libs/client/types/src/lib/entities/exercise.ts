import { DifficultyType } from './difficulty';

export type Exercise = {
  id: number;
  name: string;
  description: ExerciseDescription;
  video: string;
  coins: number;
  difficulty: DifficultyType;
};

export enum ExerciseDescriptionType {
  DESCRIPTION = 'DESCRIPTION',
  EXECUTION = 'EXECUTION',
  MUSCLES = 'MUSCLES',
}

export type ExerciseDescription = {
  [k in ExerciseDescriptionType]: string;
};
