import { DifficultyType } from '@bregenz-bewegt/client/types';

export const difficultyDisplayTexts: { [K in DifficultyType]: string } = {
  [DifficultyType.BEGINNER]: 'Anfänger',
  [DifficultyType.ADVANCED]: 'Fortgeschritten',
  [DifficultyType.GAME]: 'Spiele',
};
