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
      {isLoaded ? (
        <img onLoad={() => setIsImageLoaded(true)} src={image} alt="park" />
      ) : (
        <IonSkeletonText style={{ height: '200px', margin: 0 }} animated />
      )}
      <IonCardHeader>
        <IonCardTitle>
          {isLoaded ? title : <IonSkeletonText animated />}
        </IonCardTitle>
        <IonCardSubtitle>
          {isLoaded ? (
            <>
              <Location variant="Bold" size={16} />

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
