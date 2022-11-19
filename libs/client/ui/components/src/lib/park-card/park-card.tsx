import './park-card.scss';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonSkeletonText,
} from '@ionic/react';
import { useState } from 'react';
import { Location } from 'iconsax-react';

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
        style={!isLoaded ? { display: 'none' } : {}}
      />
      {!isLoaded && (
        <IonSkeletonText className="park-card__skeleton-image" animated />
      )}
      <IonCardHeader>
        <IonCardTitle>
          {isLoaded ? (
            title
          ) : (
            <IonSkeletonText className="park-card__skeleton-text" animated />
          )}
        </IonCardTitle>
        <IonCardSubtitle>
          {isLoaded ? (
            <>
              <Location variant="Bold" size={16} />
              <span>{location}</span>
            </>
          ) : (
            <IonSkeletonText className="park-card__skeleton-text" animated />
          )}
        </IonCardSubtitle>
      </IonCardHeader>
    </IonCard>
  );
};
