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
  IonRefresher,
  IonRefresherContent,
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
    const handleRefresh = (e: any) => {
      setTimeout(() => {
        e.detail.complete();
      }, 2000);
    };

    console.log(notificationsStore?.notifications);

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
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent refreshingSpinner="crescent"></IonRefresherContent>
          </IonRefresher>
          <IonList>
            {notificationsStore?.notifications &&
              notificationsStore.notifications?.length > 0 &&
              notificationsStore?.notifications.map((notification) => {
                return (
                  <IonItem detail={true} routerLink={notification.routerLink}>
                    <IonLabel>
                      <h3>{notification.title}</h3>
                      <p>{notification.description}</p>
                    </IonLabel>
                  </IonItem>
                );
              })}
          </IonList>
        </IonContent>
      </IonPage>
    );
  })
);
