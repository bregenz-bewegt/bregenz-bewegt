import React from 'react';
import './exercise-card.scss';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonSkeletonText,
} from '@ionic/react';
import { Exercise } from '@bregenz-bewegt/client/types';
import { play } from 'ionicons/icons';
import { DifficultyBadge } from '../difficulty-badge/difficulty-badge';

export interface ExerciseCardProps extends Exercise {
  link: string;
  isLoading?: string;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  id,
  name,
  description,
  difficulty,
  coins,
  video,
  link,
  isLoading,
}) => {
  const isLoaded = !isLoading;

  return (
    <IonCard
      routerLink={isLoaded ? link : undefined}
      routerDirection="forward"
      className="exercise-card"
      mode="ios"
    >
      <div className="exercise-card__wrapper">
        <div className="exercise-card__wrapper__content">
          <IonCardHeader>
            <DifficultyBadge difficulty={difficulty} />
            <IonCardTitle>
              <h3>{isLoaded ? name : <IonSkeletonText animated />}</h3>
            </IonCardTitle>
            {isLoaded ? coins + ' B-Bucks' : <IonSkeletonText animated />}
          </IonCardHeader>
        </div>
        <div className="exercise-card__wrapper__video">
          <IonIcon icon={play} />
        </div>
      </div>
    </IonCard>
  );
};
