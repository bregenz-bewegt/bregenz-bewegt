import {
  FriendsStore,
  friendsStore,
} from '@bregenz-bewegt/client/common/stores';
import { AllFriendRequestUsers } from '@bregenz-bewegt/shared/types';
import { IonGrid, IonItem, IonList, IonRow, IonText } from '@ionic/react';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import './request-list.scss';

export interface RequestProps {
  friendsStore?: FriendsStore;
}

export const RequestList: React.FC<RequestProps> = inject(
  friendsStore.storeKey
)(
  observer(({ friendsStore }) => {
    const [requests, setRequests] = useState<AllFriendRequestUsers>();

    useEffect(() => {
      friendsStore
        ?.getAllFriendRequests()
        .then((data) => {
          console.log(data);
          setRequests(data);
        })
        .catch((e) => {
          console.log(e);
        });
    }, []);

    return (
      <div className="request-list">
        <IonGrid>
          <IonRow>
            <IonText>
              <h2>Empfangen</h2>
            </IonText>
          </IonRow>
          <IonList>
            {requests?.received.map((r) => (
              <IonItem>{r.username}</IonItem>
            ))}
          </IonList>

          <IonRow>
            <IonText>
              <h2>Gesendet</h2>
            </IonText>
          </IonRow>
          <IonList>
            {requests?.requested.map((r) => (
              <IonItem>{r.username}</IonItem>
            ))}
          </IonList>
        </IonGrid>
      </div>
    );
  })
);
