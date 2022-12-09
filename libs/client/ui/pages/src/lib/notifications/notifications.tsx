import React from 'react';
import './notifications.scss';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react/';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import {
  notificationsStore,
  NotificationsStore,
} from '@bregenz-bewegt/client/common/stores';
import { inject, observer } from 'mobx-react';

export interface NotificationsProps {
  notificationsStore?: NotificationsStore;
}

export const Notifications: React.FC<NotificationsProps> = inject(
  notificationsStore.storeKey
)(
  observer(({ notificationsStore }) => {
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
            notificationsStore?.notifications.map((notification) => {
              return (
                <IonItem detail routerLink={notification.routerLink} mode="ios">
                  <IonLabel>
                    <h2>{notification.title}</h2>
                    <p>{notification.description}</p>
                  </IonLabel>
                </IonItem>
              );
            })
          ) : (
            <IonText className="notifications__content__no-notifications">
              keine Benachrichtigungen
            </IonText>
          )}
        </IonContent>
      </IonPage>
    );
  })
);
