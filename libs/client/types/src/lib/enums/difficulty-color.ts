import { DifficultyType } from '../entities';

export const difficultyColor: { [K in DifficultyType]: string } = {
  [DifficultyType.BEGINNER]: 'var(--ion-color-difficulty-beginner)',
  [DifficultyType.ADVANCED]: 'var(--ion-color-difficulty-advanced)',
  [DifficultyType.GAME]: 'var(--ion-color-difficulty-game)',
};
