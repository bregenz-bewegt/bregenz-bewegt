import React from 'react';
import './activity-card.scss';
import { IonCard } from '@ionic/react';
import { Activity } from '@bregenz-bewegt/client/types';
import { DifficultyBadge } from '../difficulty-badge/difficulty-badge';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';

export interface ActivityCardProps {
  activity: Activity & { minutes?: number; seconds?: number };
  key: number;
  className?: string;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  key,
  className,
}: ActivityCardProps) => {
  return (
    <IonCard
      routerLink={`${tabRoutes.start.route}/${activity.park.id}/${activity.exercise.id}`}
      routerDirection="forward"
      className={`activity-card ${className ?? ''}`}
      mode="ios"
      key={key}
    >
      <div>
        <div>
          <span>{activity.exercise.name}</span>
          {activity.park.name}
        </div>
        <div>
          <DifficultyBadge difficulty={activity.exercise.difficulty} />
          <span>{activity.exercise.coins} B-Bucks</span>
          <span>
            {activity.minutes}min {activity.seconds}sec
          </span>
        </div>
      </div>
    </IonCard>
  );
};
