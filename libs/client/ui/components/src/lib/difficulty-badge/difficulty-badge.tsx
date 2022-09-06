import './difficulty-badge.scss';
import { Difficulty } from '@bregenz-bewegt/client/types';
import { IonBadge } from '@ionic/react';
import { difficultyDisplayTexts } from '@bregenz-bewegt/client/ui/shared/content';

export interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
}) => {
  return (
    <IonBadge className="difficulty-badge" color="secondary">
      {difficultyDisplayTexts[difficulty]}
    </IonBadge>
  );
};
