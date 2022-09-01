import './difficulty-badge.scss';
import { Difficulty } from '@bregenz-bewegt/client/types';
import { IonText } from '@ionic/react';

export interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
}) => {
  return (
    <div>
      <IonText>{difficulty}</IonText>
    </div>
  );
};
