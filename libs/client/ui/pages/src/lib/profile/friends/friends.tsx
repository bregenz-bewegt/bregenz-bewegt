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
  IonBackButton,
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
            <IonSegmentButton value={FriendsDisplayType.Chats}>
              Chats
            </IonSegmentButton>
          </IonSegment>
          {friendsDisplayType === FriendsDisplayType.Requests ? (
            <RequestList />
          ) : friendsDisplayType === FriendsDisplayType.Chats ? (
            <Chat />
          ) : (
            <FriendList />
          )}
        </IonContent>
      </IonPage>
    );
  })
);
