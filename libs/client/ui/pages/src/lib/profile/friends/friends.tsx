import { BackButton } from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import {
  friendsStore,
  FriendsStore,
} from '@bregenz-bewegt/client/common/stores';
import { FriendsDisplaySegment } from '@bregenz-bewegt/client/types';
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
import { useHistory } from 'react-router-dom';
import { FriendList, RequestList, Chats } from '.';
import './friends.scss';

export interface FriendsProps {
  friendsStore?: FriendsStore;
}

export const Friends: React.FC<FriendsProps> = inject(friendsStore.storeKey)(
  observer(() => {
    const history = useHistory<{ segment: FriendsDisplaySegment }>();
    const [friendsDisplayType, setFriendsDisplayType] =
      useState<FriendsDisplaySegment>(
        history.location?.state?.segment ?? FriendsDisplaySegment.Friends
      );
    const page = useRef(undefined);

    return (
      <IonPage className="friends" ref={page}>
        <IonHeader mode="ios" collapse="condense" className="ion-no-border">
          <IonToolbar>
            <IonButtons>
              <BackButton
                defaultRouterLink={tabRoutes.profile.route}
                invertColor
              />
            </IonButtons>
            <IonTitle>Freunde</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="friends__content" fullscreen>
          <IonSegment
            value={friendsDisplayType}
            onIonChange={(e) =>
              setFriendsDisplayType(e.detail.value as FriendsDisplaySegment)
            }
            mode="ios"
            className="friends__content__segment"
          >
            <IonSegmentButton value={FriendsDisplaySegment.Friends}>
              Freunde
            </IonSegmentButton>
            <IonSegmentButton value={FriendsDisplaySegment.Requests}>
              Anfragen
            </IonSegmentButton>
            <IonSegmentButton value={FriendsDisplaySegment.Chats}>
              Chats
            </IonSegmentButton>
          </IonSegment>
          {friendsDisplayType === FriendsDisplaySegment.Requests ? (
            <RequestList />
          ) : friendsDisplayType === FriendsDisplaySegment.Chats ? (
            <Chats />
          ) : (
            <FriendList />
          )}
        </IonContent>
      </IonPage>
    );
  })
);
