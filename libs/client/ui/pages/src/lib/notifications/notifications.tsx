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
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
} from '@ionic/react/';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import {
  friendsStore,
  FriendsStore,
  notificationsStore,
  NotificationsStore,
  userStore,
  UserStore,
} from '@bregenz-bewegt/client/common/stores';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Notification, NotificationType } from '@bregenz-bewegt/client/types';
import {
  useDefaultErrorToast,
  useIsGuest,
} from '@bregenz-bewegt/client/common/hooks';
import { checkmarkDone } from 'ionicons/icons';

export interface NotificationsProps {
  notificationsStore?: NotificationsStore;
  friendsStore?: FriendsStore;
  userStore?: UserStore;
}

export const Notifications: React.FC<NotificationsProps> = inject(
  notificationsStore.storeKey,
  friendsStore.storeKey,
  userStore.storeKey
)(
  observer(({ friendsStore, notificationsStore, userStore }) => {
    const [presentDefaultErrorToast] = useDefaultErrorToast();
    const [isGuest] = useIsGuest();

    const markAsDone = (notificationId: Notification['id']) => {
      notificationsStore
        ?.markNotificationAsRead({ notificationId })
        .then(() => notificationsStore?.fetchNotifications())
        .catch(() => {
          presentDefaultErrorToast();
        });
    };

    const handleRefresh = (e: any) => {
      if (isGuest) return setTimeout(() => e.target.complete(), 500);

      return notificationsStore
        ?.fetchNotifications()
        .then(() => e.target.complete())
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
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent
              refreshingSpinner={`crescent`}
            ></IonRefresherContent>
          </IonRefresher>
          {notificationsStore?.notifications &&
          notificationsStore.notifications?.length > 0 ? (
            notificationsStore?.notifications.map((notification, i) => {
              console.log(notification.type);
              return (
                <IonItemSliding
                  key={`${JSON.stringify(toJS(notification))}-${i}`}
                >
                  <IonItem
                    detail
                    routerLink={
                      notification.type === NotificationType.FRIEND_REQUEST
                        ? `${tabRoutes.profile.route}/friends`
                        : undefined
                    }
                    mode="ios"
                  >
                    <IonLabel>
                      <h2>{notification.title}</h2>
                      <p>{notification.description}</p>
                    </IonLabel>
                  </IonItem>
                  <IonItemOptions side="end">
                    <IonItemOption
                      onClick={(e) => {
                        markAsDone(notification.id);
                      }}
                      color="medium"
                    >
                      <IonIcon slot="icon-only" icon={checkmarkDone}></IonIcon>
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              );
            })
          ) : (
            <p className="notifications__content__no-notifications">
              Keine Benachrichtigungen
            </p>
          )}
        </IonContent>
      </IonPage>
    );
  })
);
