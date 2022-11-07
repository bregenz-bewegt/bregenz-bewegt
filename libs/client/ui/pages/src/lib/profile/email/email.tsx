import { Input } from '@bregenz-bewegt/client-ui-components';
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
import React from 'react';

export interface EmailProps {
  userStore?: UserStore;
}

export const Email: React.FC<EmailProps> = inject(userStore.storeKey)(
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
            <IonTitle>E-Mail Adresse ändern</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen scrollY={false}>
          <IonGrid>
            <IonRow>
              <Input
                name="email"
                placeholder="E-Mail"
                label="E-Mail"
                value={userStore?.user?.email}
                disabled
              />
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    );
  })
);
