import './park-card.scss';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from '@ionic/react';

export interface ParkCardProps {
  title: string;
  location: string;
  image: string;
  link: string;
}

export const ParkCard: React.FC<ParkCardProps> = ({
  title,
  location,
  image,
  link,
}: ParkCardProps) => {
  return (
    <IonCard href={link}>
      <img src={image} alt="park" />
      <IonCardHeader>
        <IonCardSubtitle>{location}</IonCardSubtitle>
        <IonCardTitle>{title}</IonCardTitle>
      </IonCardHeader>
    </IonCard>
  );
};

export default ParkCard;
