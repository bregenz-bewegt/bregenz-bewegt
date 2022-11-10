import React from 'react';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';

export interface PasswordProps {
  userStore?: UserStore;
}

export const Password: React.FC<PasswordProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    return (
      <IonPage>
        <IonHeader mode="ios">
          <IonToolbar>
            <IonButtons>
              <IonBackButton
                color="primary"
                defaultHref={tabRoutes.profile.route}
                text="Zurück"
              />
            </IonButtons>
            <IonTitle>Passwort ändern</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen scrollY={false}>
          <IonGrid>
            <IonRow>Passwort ändern</IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    );
  })
);
