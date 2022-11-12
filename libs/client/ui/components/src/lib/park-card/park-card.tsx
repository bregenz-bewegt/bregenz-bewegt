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
        <IonSkeletonText style={{ height: '150px', margin: 0 }} animated />
      )}
      <IonCardHeader>
        <IonCardTitle>
          {isLoaded ? (
            title
          ) : (
            <IonSkeletonText style={{ height: '20px' }} animated />
          )}
        </IonCardTitle>
        <IonCardSubtitle>
          {isLoaded ? (
            <>
              <Location variant="Bold" size={16} />

              {location}
            </>
          ) : (
            <IonSkeletonText style={{ height: '20px' }} animated />
          )}
        </IonCardSubtitle>
      </IonCardHeader>
    </IonCard>
  );
};
