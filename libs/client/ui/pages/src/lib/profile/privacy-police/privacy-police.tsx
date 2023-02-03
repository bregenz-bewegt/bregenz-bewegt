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
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { UserStore } from '@bregenz-bewegt/client/common/stores';
import { BackButton } from '@bregenz-bewegt/client-ui-components';
import { PrivacyPoliceContent } from '@bregenz-bewegt/shared/ui/components';

export interface PrivacyPoliceProps {
  userStore?: UserStore;
}

export const PrivacyPoliceProps: React.FC<PrivacyPoliceProps> = () => {
  return (
    <IonPage className="privacy-police">
      <IonHeader mode="ios" collapse="condense" className="ion-no-border">
        <IonToolbar>
          <IonButtons>
            <BackButton defaultRouterLink={tabRoutes.profile.route} />
          </IonButtons>
          <IonTitle>Datenschutzbestimmungen</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="privacy-police__content">
        <PrivacyPoliceContent />
      </IonContent>
    </IonPage>
  );
};
