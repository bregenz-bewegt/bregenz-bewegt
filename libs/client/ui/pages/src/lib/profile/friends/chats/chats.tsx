import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
} from '@ionic/react';
import React from 'react';
import './chats.scss';

export interface ChatProps {}

export const Chats: React.FC<ChatProps> = ({}) => {
  return (
    <IonPage className="chats">
      <IonHeader mode="ios">
        <IonToolbar>
          <IonButtons>
            <IonBackButton
              color="primary"
              defaultHref={tabRoutes.profile.route}
              text="Zurück"
            />
          </IonButtons>
          <IonTitle>Chats</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="chats__content" fullscreen></IonContent>
    </IonPage>
  );
};
