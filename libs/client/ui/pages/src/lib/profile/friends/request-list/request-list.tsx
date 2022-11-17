import { friendsStore } from '@bregenz-bewegt/client/common/stores';
import { IonGrid, IonRow, IonText } from '@ionic/react';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { FriendsProps } from '../friends';
import './request-list.scss';

export interface RequestProps {
  friendsStore?: FriendsProps;
}

export const RequestList: React.FC<RequestProps> = inject(
  friendsStore.storeKey
)(
  observer(({ friendsStore }) => {
    return (
      <div className="request-list">
        <IonGrid>
          <IonRow>
            <IonText>
              <h2>Anfragen</h2>
            </IonText>
          </IonRow>
        </IonGrid>
      </div>
    );
  })
);
