import React from 'react';
import './activity-card.scss';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from '@ionic/react';
import { Activity } from '@bregenz-bewegt/client/types';
import { DifficultyBadge } from '../difficulty-badge/difficulty-badge';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { Location } from 'iconsax-react';

export interface ActivityCardProps {
  activity: Activity & { minutes?: string; seconds?: string };
  className?: string;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  className,
}: ActivityCardProps) => {
  return (
    <IonCard
      routerLink={`${tabRoutes.start.route}/${activity.park.id}/${activity.exercise.id}`}
      routerDirection="forward"
      className={`activity-card ${className ?? ''}`}
      mode="ios"
    >
      <div className="activity-card__flex-wrapper">
        <IonCardHeader>
          <IonCardTitle>{activity.exercise.name}</IonCardTitle>
          <IonCardSubtitle>
            <Location variant="Bold" size={12} />
            {activity.park.name}
          </IonCardSubtitle>
          <DifficultyBadge difficulty={activity.exercise.difficulty} />
        </IonCardHeader>
        <IonCardContent>
          <span className="activity-card__coins">
            <span>+{activity.exercise.coins}</span>
          </span>
          <div>
            {activity.minutes}:{activity.seconds}
          </div>
        </IonCardContent>
      </div>
    </IonCard>
  );
};
