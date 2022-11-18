import { useDefaultErrorToast } from '@bregenz-bewegt/client/common/hooks';
import {
  FriendsStore,
  friendsStore,
  userStore,
  UserStore,
} from '@bregenz-bewegt/client/common/stores';
import { AllFriendRequestUsers } from '@bregenz-bewegt/shared/types';
import {
  IonAvatar,
  IonButton,
  IonCol,
  IonGrid,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonText,
} from '@ionic/react';
import { CloseCircle, TickCircle } from 'iconsax-react';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import './request-list.scss';

export interface RequestProps {
  friendsStore?: FriendsStore;
  userStore?: UserStore;
}

export const RequestList: React.FC<RequestProps> = inject(
  friendsStore.storeKey,
  userStore.storeKey
)(
  observer(({ friendsStore, userStore }) => {
    const [requests, setRequests] = useState<AllFriendRequestUsers>();
    const [presentDefaultErrorToast] = useDefaultErrorToast();

    useEffect(() => {
      friendsStore
        ?.getAllFriendRequests()
        .then((data) => {
          setRequests(data);
        })
        .catch(() => {
          presentDefaultErrorToast();
        });
    }, []);

    const acceptRequest = () => {
      //
    };

    const rejectRequest = () => {
      //
    };

    const revokeRequest = () => {
      //
    };

    return (
      <div className="request-list">
        <IonGrid>
          <IonRow>
            <IonText>
              <h2>Empfangen</h2>
            </IonText>
          </IonRow>
          <IonList className="request-list__received">
            {requests?.received && requests.received.length > 0 ? (
              requests.received.map((user) => {
                return (
                  <IonRow key={user.id}>
                    <IonCol size="auto" className="username-avatar-col">
                      <IonItem
                        key={user.id}
                        routerLink={`/users/${user.id}`}
                        detail={false}
                        lines="none"
                      >
                        <IonAvatar className="avatar" slot="start">
                          <img
                            src={
                              user.profilePicture
                                ? userStore?.getProfilePictureUrl(
                                    user.profilePicture
                                  )
                                : userStore?.getAvatarProfilePictureUrl(
                                    user.username
                                  )
                            }
                            alt="avatar"
                          />
                        </IonAvatar>
                        <IonLabel>{user.username}</IonLabel>
                      </IonItem>
                    </IonCol>
                    <IonCol size="auto">
                      <IonButton
                        fill="clear"
                        onClick={() => rejectRequest()}
                        className="reject"
                      >
                        <CloseCircle
                          variant="Bold"
                          color={`var(--ion-color-danger)`}
                        />
                      </IonButton>
                      <IonButton
                        fill="clear"
                        onClick={() => acceptRequest()}
                        className="accept"
                      >
                        <TickCircle
                          variant="Bold"
                          color={`var(--ion-color-success)`}
                        />
                      </IonButton>
                    </IonCol>
                  </IonRow>
                );
              })
            ) : (
              <IonRow className="no-results">
                <IonItem lines="none">Keine Anfragen</IonItem>
              </IonRow>
            )}
          </IonList>
          <IonRow>
            <IonText>
              <h2>Gesendet</h2>
            </IonText>
          </IonRow>
          <IonList className="request-list__requested">
            {requests?.requested && requests.requested.length > 0 ? (
              requests.requested.map((user) => {
                return (
                  <IonRow key={user.id}>
                    <IonCol size="auto" className="username-avatar-col">
                      <IonItem
                        key={user.id}
                        routerLink={`/users/${user.id}`}
                        detail={false}
                        lines="none"
                      >
                        <IonAvatar className="avatar" slot="start">
                          <img
                            src={
                              user.profilePicture
                                ? userStore?.getProfilePictureUrl(
                                    user.profilePicture
                                  )
                                : userStore?.getAvatarProfilePictureUrl(
                                    user.username
                                  )
                            }
                            alt="avatar"
                          />
                        </IonAvatar>
                        <IonLabel>{user.username}</IonLabel>
                      </IonItem>
                    </IonCol>
                    <IonCol size="auto">
                      <IonButton fill="clear" onClick={() => revokeRequest()}>
                        <CloseCircle
                          variant="Bold"
                          color={`var(--ion-color-danger)`}
                        />
                      </IonButton>
                    </IonCol>
                  </IonRow>
                );
              })
            ) : (
              <IonRow className="no-results">
                <IonItem lines="none">Keine Anfragen</IonItem>
              </IonRow>
            )}
          </IonList>
        </IonGrid>
      </div>
    );
  })
);
