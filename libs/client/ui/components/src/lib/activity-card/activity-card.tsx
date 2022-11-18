import React from 'react';
import './activity-card.scss';
import { IonCard } from '@ionic/react';
import { Activity } from '@bregenz-bewegt/client/types';
import { DifficultyBadge } from '../difficulty-badge/difficulty-badge';

export interface ActivityCardProps {
  activity: Activity & { minutes?: number; seconds?: number };
  key: number;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  key,
}: ActivityCardProps) => {
  return (
    <IonCard
      routerLink={undefined}
      routerDirection="forward"
      className="exercise-card"
      mode="ios"
      key={key}
    >
      <DifficultyBadge difficulty={activity.exercise.difficulty} />
      <h5>{activity.exercise.name}</h5>
      {activity.exercise.coins} B-Bucks | {activity.park.name} |
      {activity.minutes}
      min {activity.seconds}sec
    </IonCard>
  );
};
