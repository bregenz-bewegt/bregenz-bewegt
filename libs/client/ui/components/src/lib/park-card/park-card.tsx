import './park-card.scss';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonSkeletonText,
} from '@ionic/react';
import { useState } from 'react';
import { location as locationIcon } from 'ionicons/icons';

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
  isLoading = false,
}: ParkCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const isLoaded = !isLoading && isImageLoaded;

  return (
    <IonCard
      routerLink={isLoaded ? link : undefined}
      routerDirection="forward"
      className="park-card"
      mode="ios"
    >
      <img
        onLoad={() => setIsImageLoaded(true)}
        src={image}
        alt="park"
        style={{ display: isLoaded ? 'initial' : 'none' }}
      />
      {!isLoaded && <IonSkeletonText style={{ height: '64px' }} animated />}
      <IonCardHeader>
        <IonCardTitle>
          {isLoaded ? title : <IonSkeletonText animated />}
        </IonCardTitle>
        <IonCardSubtitle>
          {isLoaded ? (
            <>
              <IonIcon icon={locationIcon} />
              {location}
            </>
          ) : (
            <IonSkeletonText animated />
          )}
        </IonCardSubtitle>
      </IonCardHeader>
    </IonCard>
  );
};
