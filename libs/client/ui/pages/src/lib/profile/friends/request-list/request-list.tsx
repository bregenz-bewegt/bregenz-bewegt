import { useDefaultErrorToast } from '@bregenz-bewegt/client/common/hooks';
import {
  FriendsStore,
  friendsStore,
  userStore,
  UserStore,
} from '@bregenz-bewegt/client/common/stores';
import { FriendRequest } from '@bregenz-bewegt/client/types';
import { AllFriendRequests } from '@bregenz-bewegt/shared/types';
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
    const [requests, setRequests] = useState<AllFriendRequests>();
    const [presentDefaultErrorToast] = useDefaultErrorToast();

    const fetchFriendRequests = () => {
      friendsStore
        ?.getAllFriendRequests()
        .then((data) => {
          setRequests(data);
        })
        .catch(() => {
          presentDefaultErrorToast();
        });
    };

    useEffect(() => {
      fetchFriendRequests();
    }, []);

    const acceptRequest = (requestId: FriendRequest['id']) => {
      friendsStore
        ?.acceptFriendRequest({ requestId })
        .then(() => {
          fetchFriendRequests();
        })
        .catch(() => {
          presentDefaultErrorToast();
        });
    };

    const rejectRequest = (requestId: FriendRequest['id']) => {
      friendsStore
        ?.rejectFriendRequest({ requestId })
        .then(() => {
          fetchFriendRequests();
        })
        .catch(() => {
          presentDefaultErrorToast();
        });
    };

    const revokeRequest = (requestId: FriendRequest['id']) => {
      friendsStore
        ?.revokeFriendRequest({ requestId })
        .then(() => {
          fetchFriendRequests();
        })
        .catch(() => {
          presentDefaultErrorToast();
        });
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
              requests.received.map((request) => {
                return (
                  <IonRow key={request.id}>
                    <IonCol size="auto" className="username-avatar-col">
                      <IonItem
                        key={request.id}
                        routerLink={`/users/${request.requestee.id}`}
                        detail={false}
                        lines="none"
                      >
                        <IonAvatar className="avatar" slot="start">
                          <img
                            src={
                              request.requestee.profilePicture ??
                              userStore?.getAvatarProfilePictureUrl(
                                request.requestee.username
                              )
                            }
                            alt="avatar"
                          />
                        </IonAvatar>
                        <IonLabel>{request.requestee.username}</IonLabel>
                      </IonItem>
                    </IonCol>
                    <IonCol size="auto">
                      <IonButton
                        fill="clear"
                        onClick={() => rejectRequest(request.id)}
                        className="reject"
                      >
                        <CloseCircle
                          variant="Bold"
                          color={`var(--ion-color-danger)`}
                        />
                      </IonButton>
                      <IonButton
                        fill="clear"
                        onClick={() => acceptRequest(request.id)}
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
              requests.requested.map((request) => {
                return (
                  <IonRow key={request.id}>
                    <IonCol size="auto" className="username-avatar-col">
                      <IonItem
                        key={request.id}
                        routerLink={`/users/${request.addressee.id}`}
                        detail={false}
                        lines="none"
                      >
                        <IonAvatar className="avatar" slot="start">
                          <img
                            src={
                              request.addressee.profilePicture ??
                              userStore?.getAvatarProfilePictureUrl(
                                request.addressee.username
                              )
                            }
                            alt="avatar"
                          />
                        </IonAvatar>
                        <IonLabel>{request.addressee.username}</IonLabel>
                      </IonItem>
                    </IonCol>
                    <IonCol size="auto">
                      <IonButton
                        fill="clear"
                        onClick={() => revokeRequest(request.id)}
                      >
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
