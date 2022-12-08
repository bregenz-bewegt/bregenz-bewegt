import React from 'react';
import './notifications.scss';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { Header } from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';

export interface NotificationsProps {}

export const Notifications: React.FC<NotificationsProps> = () => {
  return (
    <IonPage className="notifications">
      <IonHeader mode="ios">
        <IonToolbar>
          <IonButtons>
            <IonBackButton
              color="primary"
              defaultHref={`${tabRoutes.profile.route}/friends`}
              text="Zurück"
            />
          </IonButtons>
          <IonTitle>Benutzer</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>notifications</IonContent>
    </IonPage>
  );
};
