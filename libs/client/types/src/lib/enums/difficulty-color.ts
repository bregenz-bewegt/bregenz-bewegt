import { DifficultyType } from '../entities';

export const difficultyColor: {
  [K in DifficultyType]: { main: string; tint: string; dark: string };
} = {
  [DifficultyType.BEGINNER]: {
    main: 'var(--ion-color-difficulty-beginner)',
    tint: 'var(--ion-color-difficulty-beginner-tint)',
    dark: 'var(--ion-color-difficulty-beginner-dark)',
  },
  [DifficultyType.ADVANCED]: {
    main: 'var(--ion-color-difficulty-advanced)',
    tint: 'var(--ion-color-difficulty-advanced-tint)',
    dark: 'var(--ion-color-difficulty-advanced-dark)',
  },
  [DifficultyType.GAME]: {
    main: 'var(--ion-color-difficulty-game)',
    tint: 'var(--ion-color-difficulty-game-tint)',
    dark: 'var(--ion-color-difficulty-game-dark)',
  },
};
