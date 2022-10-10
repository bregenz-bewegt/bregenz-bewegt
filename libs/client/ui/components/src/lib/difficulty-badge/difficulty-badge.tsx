import './difficulty-badge.scss';
import { DifficultyType } from '@bregenz-bewegt/client/types';
import { IonBadge } from '@ionic/react';
import { difficultyDisplayTexts } from '@bregenz-bewegt/client/ui/shared/content';

export interface DifficultyBadgeProps {
  difficulty: DifficultyType;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
}) => {
  return (
    <IonBadge className="difficulty-badge" color="secondary" mode="ios">
      {difficultyDisplayTexts[difficulty]}
    </IonBadge>
  );
};
