import './difficulty-badge.scss';
import { Difficulty } from '@bregenz-bewegt/client/types';
import { IonBadge } from '@ionic/react';

export interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
}) => {
  const displayTexts: { [K in Difficulty]: string } = {
    [Difficulty.BEGINNER]: 'Anfänger',
    [Difficulty.ADVANCED]: 'Fortgeschritten',
    [Difficulty.GAME]: 'Spiel',
  };
  return (
    <IonBadge className="difficulty-badge" color="primary">
      {displayTexts[difficulty]}
    </IonBadge>
  );
};
