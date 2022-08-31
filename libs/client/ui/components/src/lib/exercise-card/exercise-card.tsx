import React, { useState } from 'react';
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
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const isLoaded = !isLoading && isImageLoaded;

  return (
    <IonCard routerLink={link}>
      <IonCard
        routerLink={isLoaded ? link : undefined}
        routerDirection="forward"
      >
        {!isLoaded && <IonSkeletonText style={{ height: '64px' }} animated />}
        <IonCardHeader>
          <IonCardTitle>
            {isLoaded ? name : <IonSkeletonText animated />}
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {isLoaded ? description : <IonSkeletonText animated />}
        </IonCardContent>
      </IonCard>
    </IonCard>
  );
};
