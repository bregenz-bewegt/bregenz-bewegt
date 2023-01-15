import React from 'react';
import './sponsors.scss';
import {
  IonPage,
  IonContent,
  IonButtons,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { BackButton } from '@bregenz-bewegt/client-ui-components';

export const Sponsors: React.FC = () => {
  return (
    <IonPage className="sponsors">
      <IonHeader mode="ios" collapse="condense" className="ion-no-border">
        <IonToolbar>
          <IonButtons>
            <BackButton defaultRouterLink={tabRoutes.profile.route} />
          </IonButtons>
          <IonTitle>Darstellung</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="sponsors__content"></IonContent>
    </IonPage>
  );
};
