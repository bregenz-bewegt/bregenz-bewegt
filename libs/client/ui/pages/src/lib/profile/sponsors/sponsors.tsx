import React from 'react';
import './sponsors.scss';
import {
  IonPage,
  IonContent,
  IonBackButton,
  IonButtons,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';

export const Sponsors: React.FC = () => {
  return (
    <IonPage className="sponsors">
      <IonHeader mode="ios">
        <IonToolbar>
          <IonButtons>
            <IonBackButton
              color="primary"
              defaultHref={tabRoutes.profile.route}
              text="Zurück"
            />
          </IonButtons>
          <IonTitle>Sponsoren</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="sponsors__content"></IonContent>
    </IonPage>
  );
};
