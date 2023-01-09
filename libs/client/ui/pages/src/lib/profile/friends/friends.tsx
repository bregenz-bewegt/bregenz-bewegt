import { BackButton } from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import {
  friendsStore,
  FriendsStore,
} from '@bregenz-bewegt/client/common/stores';
import { FriendsDisplayType } from '@bregenz-bewegt/client/types';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import React, { useRef, useState } from 'react';
import { FriendList } from './friend-list/friend-list';
import './friends.scss';
import { RequestList } from './request-list/request-list';

export interface FriendsProps {
  friendsStore?: FriendsStore;
}

export const Friends: React.FC<FriendsProps> = inject(friendsStore.storeKey)(
  observer(() => {
    const [friendsDisplayType, setFriendsDisplayType] =
      useState<FriendsDisplayType>(FriendsDisplayType.Friends);
    const page = useRef(undefined);

    return (
      <IonPage className="friends" ref={page}>
        <IonHeader mode="ios" collapse="condense" className="ion-no-border">
          <IonToolbar>
            <IonButtons>
              <BackButton defaultRouterLink={tabRoutes.profile.route} />
            </IonButtons>
            <IonTitle>Freunde</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="friends__content" fullscreen>
          <IonSegment
            value={friendsDisplayType}
            onIonChange={(e) =>
              setFriendsDisplayType(e.detail.value as FriendsDisplayType)
            }
            mode="ios"
            className="friends__content__segment"
          >
            <IonSegmentButton value={FriendsDisplayType.Friends}>
              Freunde
            </IonSegmentButton>
            <IonSegmentButton value={FriendsDisplayType.Requests}>
              Anfragen
            </IonSegmentButton>
          </IonSegment>
          {friendsDisplayType === FriendsDisplayType.Friends ? (
            <FriendList />
          ) : (
            <RequestList />
          )}
        </IonContent>
      </IonPage>
    );
  })
);
