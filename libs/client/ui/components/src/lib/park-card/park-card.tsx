import './park-card.scss';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonSkeletonText,
} from '@ionic/react';
import { useState } from 'react';

export interface ParkCardProps {
  title: string;
  location: string;
  image: string;
  link: string;
  isLoading?: boolean;
}

export const ParkCard: React.FC<ParkCardProps> = ({
  title,
  location,
  image,
  link,
  isLoading,
}: ParkCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const isLoaded = !isLoading && isImageLoaded;

  return (
    <IonCard routerLink={isLoaded ? link : undefined} routerDirection="forward">
      {isLoaded ? (
        <img onLoad={() => setIsImageLoaded(true)} src={image} alt="park" />
      ) : (
        <IonSkeletonText style={{ height: '48px' }} animated />
      )}
      <IonCardHeader>
        <IonCardSubtitle>
          {isLoaded ? location : <IonSkeletonText animated />}
        </IonCardSubtitle>
        <IonCardTitle>
          {isLoaded ? title : <IonSkeletonText animated />}
        </IonCardTitle>
      </IonCardHeader>
    </IonCard>
  );
};

export default ParkCard;
