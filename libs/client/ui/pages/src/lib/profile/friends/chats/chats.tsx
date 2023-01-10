import { BackButton } from '@bregenz-bewegt/client-ui-components';
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
      <IonHeader mode="ios" collapse="condense" className="ion-no-border">
        <IonToolbar>
          <IonButtons>
            <BackButton defaultRouterLink={tabRoutes.profile.route} />
          </IonButtons>
          <IonTitle>Freunde</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="chats__content" fullscreen></IonContent>
    </IonPage>
  );
};
