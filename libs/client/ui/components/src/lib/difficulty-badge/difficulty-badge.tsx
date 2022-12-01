import './difficulty-badge.scss';
import { difficultyColor, DifficultyType } from '@bregenz-bewegt/client/types';
import { IonBadge } from '@ionic/react';
import { difficultyDisplayTexts } from '@bregenz-bewegt/client/ui/shared/content';

export interface DifficultyBadgeProps {
  difficulty: DifficultyType;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
}) => {
  return (
    <IonBadge
      className="difficulty-badge"
      style={{ backgroundColor: difficultyColor[difficulty] }}
      mode="ios"
    >
      {difficultyDisplayTexts[difficulty]}
    </IonBadge>
  );
};
