import React from 'react';
import {
  IonPage,
  IonContent,
  IonBackButton,
  IonButtons,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import './terms-of-service';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';

export interface TermsOfServiceProps {}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({}) => {
  return (
    <IonPage className="terms-of-service">
      <IonHeader mode="ios">
        <IonToolbar>
          <IonButtons>
            <IonBackButton
              color="primary"
              defaultHref={tabRoutes.profile.route}
              text="Zurück"
            />
          </IonButtons>
          <IonTitle>Nutzungsbedingungen</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent
        fullscreen
        scrollY={false}
        className="terms-of-service__content"
      ></IonContent>
    </IonPage>
  );
};
