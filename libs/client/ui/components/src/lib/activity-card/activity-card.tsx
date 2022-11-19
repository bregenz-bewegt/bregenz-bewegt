import React from 'react';
import './activity-card.scss';
import { IonCard } from '@ionic/react';
import { Activity } from '@bregenz-bewegt/client/types';
import { DifficultyBadge } from '../difficulty-badge/difficulty-badge';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';

export interface ActivityCardProps {
  activity: Activity & { minutes?: string; seconds?: string };
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
      <div className="activity-card__content">
        <div className="activity-card__content__main">
          <div>{activity.exercise.name}</div>
          <div>{activity.park.name}</div>
          <DifficultyBadge difficulty={activity.exercise.difficulty} />
        </div>
        <div className="activity-card__content__side">
          <div className="activity-card__content__side__coins">
            <span>+ {activity.exercise.coins}</span>
          </div>
          <div>
            {activity.minutes}:{activity.seconds}
          </div>
        </div>
      </div>
    </IonCard>
  );
};
