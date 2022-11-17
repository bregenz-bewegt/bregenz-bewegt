import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import {
  friendsStore,
  FriendsStore,
} from '@bregenz-bewegt/client/common/stores';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import React from 'react';
import './friends.scss';

export interface FriendsProps {
  friendsStore?: FriendsStore;
}

export const Friends: React.FC<FriendsProps> = inject(friendsStore.storeKey)(
  observer(({ friendsStore }) => {
    return (
      <IonPage className="friends">
        <IonHeader mode="ios">
          <IonToolbar>
            <IonButtons>
              <IonBackButton
                color="primary"
                defaultHref={tabRoutes.profile.route}
                text="Zurück"
              />
            </IonButtons>
            <IonTitle>Freunde</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="friends__content" fullscreen scrollY={false}>
          friends
        </IonContent>
      </IonPage>
    );
  })
);
