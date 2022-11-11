import { ExerciseDescriptionType } from '@bregenz-bewegt/client/types';

export const exerDescrDisplayTexts: {
  [K in ExerciseDescriptionType]: string;
} = {
  [ExerciseDescriptionType.DESCRIPTION]: 'Beschreibung',
  [ExerciseDescriptionType.EXECUTION]: 'Ausführung',
  [ExerciseDescriptionType.MUSCLES]: 'Beanspruchte Muskeln',
};
