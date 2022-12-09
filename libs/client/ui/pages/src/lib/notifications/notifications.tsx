import React from 'react';
import './notifications.scss';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react/';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import {
  friendsStore,
  FriendsStore,
  notificationsStore,
  NotificationsStore,
} from '@bregenz-bewegt/client/common/stores';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import { FriendRequest } from '@bregenz-bewegt/client/types';
import { useDefaultErrorToast } from '@bregenz-bewegt/client/common/hooks';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';

export interface NotificationsProps {
  notificationsStore?: NotificationsStore;
  friendsStore?: FriendsStore;
}

export const Notifications: React.FC<NotificationsProps> = inject(
  notificationsStore.storeKey,
  friendsStore.storeKey
)(
  observer(({ friendsStore, notificationsStore }) => {
    const [presentDefaultErrorToast] = useDefaultErrorToast();

    const acceptRequest = (requestId: FriendRequest['id']) => {
      friendsStore
        ?.acceptFriendRequest({ requestId })
        .then((data) => {
          notificationsStore?.removeNotification(data.id);
        })
        .catch(() => {
          presentDefaultErrorToast();
        });
    };

    const rejectRequest = (requestId: FriendRequest['id']) => {
      friendsStore
        ?.rejectFriendRequest({ requestId })
        .then((data) => {
          notificationsStore?.removeNotification(data.id);
        })
        .catch(() => {
          presentDefaultErrorToast();
        });
    };

    return (
      <IonPage className="notifications">
        <IonHeader mode="ios">
          <IonToolbar>
            <IonButtons>
              <IonBackButton
                color="primary"
                defaultHref={`${tabRoutes.start.route}`}
                text="Zurück"
              />
            </IonButtons>
            <IonTitle>Benachrichtigungen</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="notifications__content">
          {notificationsStore?.notifications &&
          notificationsStore.notifications?.length > 0 ? (
            notificationsStore?.notifications.map((notification, i) => {
              return (
                <IonItemSliding
                  key={`${JSON.stringify(toJS(notification))}-${i}`}
                >
                  <IonItem
                    detail
                    routerLink={notification.routerLink}
                    mode="ios"
                  >
                    <IonLabel>
                      <h2>{notification.title}</h2>
                      <p>{notification.description}</p>
                    </IonLabel>
                  </IonItem>
                  <IonItemOptions>
                    <IonItemOption
                      color="success"
                      onClick={(e) => {
                        acceptRequest(notification.id);
                      }}
                    >
                      <IonIcon
                        slot="icon-only"
                        icon={checkmarkCircle}
                      ></IonIcon>
                    </IonItemOption>
                    <IonItemOption
                      onClick={(e) => {
                        rejectRequest(notification.id);
                      }}
                      color="danger"
                    >
                      <IonIcon slot="icon-only" icon={closeCircle}></IonIcon>
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              );
            })
          ) : (
            <p className="notifications__content__no-notifications">
              keine Benachrichtigungen
            </p>
          )}
        </IonContent>
      </IonPage>
    );
  })
);
