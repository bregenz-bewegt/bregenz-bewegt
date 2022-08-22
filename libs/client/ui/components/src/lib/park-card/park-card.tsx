import './park-card.scss';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
} from '@ionic/react';

export interface ParkCardProps {
  title: string;
  location: string;
  description: string;
  image: string;
  link: string;
}

export const ParkCard: React.FC<ParkCardProps> = ({
  title,
  location,
  description,
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
      <IonCardContent>{description}</IonCardContent>
    </IonCard>
  );
};

export default ParkCard;
