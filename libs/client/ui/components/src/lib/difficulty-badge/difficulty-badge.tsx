import './difficulty-badge.scss';
import { Difficulty } from '@bregenz-bewegt/client/types';
import { IonBadge } from '@ionic/react';

export interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
}) => {
  return <IonBadge className="difficulty-badge" color="primary">{difficulty}</IonBadge>;
};
