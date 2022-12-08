import React from 'react';
import './loading.scss';
import { IonContent, IonPage } from '@ionic/react';

export interface NotificationsProps {}

export const Notifications: React.FC<NotificationsProps> = () => {
  return (
    <IonPage className="notifications">
      <IonContent fullscreen>notifications</IonContent>
    </IonPage>
  );
};
