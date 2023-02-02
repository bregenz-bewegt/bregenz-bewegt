import React from 'react';
import './terms-of-service.scss';
import {
  IonPage,
  IonContent,
  IonButtons,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { UserStore } from '@bregenz-bewegt/client/common/stores';
import { BackButton } from '@bregenz-bewegt/client-ui-components';

export interface TermsOfServiceProps {
  userStore?: UserStore;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = () => {
  return (
    <IonPage className="terms-of-service">
      <IonHeader mode="ios" collapse="condense" className="ion-no-border">
        <IonToolbar>
          <IonButtons>
            <BackButton defaultRouterLink={tabRoutes.profile.route} />
          </IonButtons>
          <IonTitle>Nutzungsbedingungen</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="terms-of-service__content"></IonContent>
    </IonPage>
  );
};
