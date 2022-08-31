import React from 'react';
import './exercise-card.scss';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSkeletonText,
} from '@ionic/react';
import { Exercise } from '@bregenz-bewegt/client/types';

export interface ExerciseCardProps extends Exercise {
  link: string;
  isLoading?: string;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  id,
  name,
  description,
  difficulty,
  points,
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
    >
      <div className="exercise-card__content">
        <IonCardHeader>
          <IonCardTitle>
            {isLoaded ? name : <IonSkeletonText animated />}
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {isLoaded ? description : <IonSkeletonText animated />}
        </IonCardContent>
      </div>
      <div className="exercise-card__video"></div>
    </IonCard>
  );
};
