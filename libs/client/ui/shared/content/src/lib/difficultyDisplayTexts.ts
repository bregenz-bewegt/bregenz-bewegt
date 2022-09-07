import { Difficulty } from '@bregenz-bewegt/client/types';

export const difficultyDisplayTexts: { [K in Difficulty]: string } = {
  [Difficulty.BEGINNER]: 'Anfänger',
  [Difficulty.ADVANCED]: 'Fortgeschritten',
  [Difficulty.GAME]: 'Spiel',
};
