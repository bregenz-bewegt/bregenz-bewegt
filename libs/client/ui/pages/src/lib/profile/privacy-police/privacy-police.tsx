import React from 'react';
import './privacy-police.scss';
import {
  IonPage,
  IonContent,
  IonButtons,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { BackButton } from '@bregenz-bewegt/client-ui-components';
import { PrivacyPoliceContent } from '@bregenz-bewegt/shared/ui/components';

export interface PrivacyPoliceProps {
  defaultBackRouterLinkt: string;
}

export const PrivacyPolice: React.FC<PrivacyPoliceProps> = ({
  defaultBackRouterLinkt,
}) => {
  return (
    <IonPage className="privacy-police">
      <IonHeader mode="ios" collapse="condense" className="ion-no-border">
        <IonToolbar>
          <IonButtons>
            <BackButton defaultRouterLink={defaultBackRouterLinkt} />
          </IonButtons>
          <IonTitle>Datenschutzerklärung</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="privacy-police__content">
        <PrivacyPoliceContent />
      </IonContent>
    </IonPage>
  );
};
