import React, { useEffect } from 'react';
import './notifications.scss';
import {
  IonBackButton,
  IonButton,
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
} from '@ionic/react';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import {
  notificationsStore,
  NotificationsStore,
} from '@bregenz-bewegt/client/common/stores';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Notification, NotificationType } from '@bregenz-bewegt/client/types';
import {
  useDefaultErrorToast,
  useIsGuest,
} from '@bregenz-bewegt/client/common/hooks';
import { checkmarkDone, trash } from 'ionicons/icons';

export interface NotificationsProps {
  notificationsStore?: NotificationsStore;
}

export const Notifications: React.FC<NotificationsProps> = inject(
  notificationsStore.storeKey
)(
  observer(({ notificationsStore }) => {
    const [presentDefaultErrorToast] = useDefaultErrorToast();
    const [isGuest] = useIsGuest();

    const deleteNotification = (notificationId: Notification['id']) => {
      notificationsStore
        ?.deleteNotification({ notificationId })
        .then(() => notificationsStore?.fetchNotifications())
        .catch(() => {
          presentDefaultErrorToast();
        });
    };

    const markNotificationAsRead = (notificationId: Notification['id']) => {
      notificationsStore
        ?.markNotificationAsRead({ notificationId })
        .then(() => notificationsStore?.fetchNotifications())
        .catch(() => {
          presentDefaultErrorToast();
        });
    };

    const markNotificationAsUnread = (notificationId: Notification['id']) => {
      notificationsStore
        ?.markNotificationAsUnread({ notificationId })
        .then(() => notificationsStore?.fetchNotifications())
        .catch(() => {
          presentDefaultErrorToast();
        });
    };

    const markAllNotificationsAsRead = () => {
      notificationsStore
        ?.markAllNotificationsAsRead()
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

    useEffect(() => {
      if (isGuest) return;

      notificationsStore?.fetchNotifications().catch(() => {
        presentDefaultErrorToast();
      });
    }, []);

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
            <IonButtons slot="end">
              <IonButton onClick={() => markAllNotificationsAsRead()}>
                <IonIcon slot="icon-only" icon={checkmarkDone}></IonIcon>
              </IonButton>
            </IonButtons>
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
              return (
                <IonItemSliding
                  key={`${JSON.stringify(toJS(notification))}-${i}`}
                >
                  <div
                    className={`unread-indicator${
                      notification.read ? ' read' : ''
                    }`}
                  ></div>
                  <IonItem
                    onClick={() => markNotificationAsRead(notification.id)}
                    routerLink={
                      [
                        NotificationType.FRIEND_REQUEST_RECEIVED,
                        NotificationType.FRIEND_REQUEST_ACCEPTED,
                      ].includes(notification.type)
                        ? `${tabRoutes.profile.route}/friends`
                        : undefined
                    }
                    mode="ios"
                    detail
                  >
                    <IonLabel>
                      <h2>{notification.title}</h2>
                      <p>
                        {`${new Date(
                          notification.createdAt
                        ).toLocaleDateString()} - ${notification.description}`}
                      </p>
                    </IonLabel>
                  </IonItem>
                  <IonItemOptions side="end">
                    {notification.read ? (
                      <IonItemOption
                        onClick={() => {
                          markNotificationAsUnread(notification.id);
                        }}
                        color={'medium'}
                      >
                        <IonIcon
                          slot="icon-only"
                          icon={checkmarkDone}
                        ></IonIcon>
                      </IonItemOption>
                    ) : (
                      <IonItemOption
                        onClick={() => {
                          markNotificationAsRead(notification.id);
                        }}
                        color={'primary'}
                      >
                        <IonIcon
                          slot="icon-only"
                          icon={checkmarkDone}
                        ></IonIcon>
                      </IonItemOption>
                    )}
                    <IonItemOption
                      onClick={() => {
                        deleteNotification(notification.id);
                      }}
                      color="danger"
                    >
                      <IonIcon slot="icon-only" icon={trash}></IonIcon>
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
