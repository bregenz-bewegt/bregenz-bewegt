import React from 'react';
import './terms-of-service.scss';
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
import { UserStore } from '@bregenz-bewegt/client/common/stores';

export interface TermsOfServiceProps {
  userStore?: UserStore;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = () => {
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
      <IonContent className="terms-of-service__content">
        <h2>Nutzungsbedingungen</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus optio
          vel at? Corporis rerum adipisci at. Sit, quae doloribus ipsa
          laboriosam eum id dolorum, eaque consequuntur quibusdam ea esse
          aspernatur?
        </p>
      </IonContent>
    </IonPage>
  );
};
