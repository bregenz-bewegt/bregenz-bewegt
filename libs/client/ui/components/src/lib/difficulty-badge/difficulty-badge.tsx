import './difficulty-badge.scss';
import { Difficulty } from '@bregenz-bewegt/client/types';

/* eslint-disable-next-line */
export interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
}) => {
  return (
    <div>
      <h1>Welcome to DifficultyBadge!</h1>
    </div>
  );
};
