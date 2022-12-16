import { useEffect } from 'react';
import { connectSocket } from '@bregenz-bewegt/client/common/socket';
import { UserStore, userStore } from '@bregenz-bewegt/client/common/stores';
import { inject, observer } from 'mobx-react';
import { useIonToast } from '@ionic/react';
import { notifications as notificationIcon, close } from 'ionicons/icons';
import type { Notification } from '@bregenz-bewegt/client/types';

export interface NotificationListenerProps {
  userStore?: UserStore;
}

export const NotificationListener: React.FC = inject(userStore.storeKey)(
  observer(() => {
    const [presentToast] = useIonToast();

    const presentNotificationToast = (notification: Notification) => {
      presentToast({
        message: notification.title,
        icon: notificationIcon,
        duration: 2000,
        position: 'top',
        mode: 'ios',
        color: 'light',
        buttons: [{ icon: close, role: 'cancel' }],
      });
    };

    useEffect(() => {
      if (!userStore.user?.id) return;

      const socket = connectSocket(userStore.user.id);

      socket.on('connect', () => {
        console.log('connected');
      });

      socket.on('connect_error', (e) => {
        console.log(e);
      });

      socket.on('receiveNotification', (notification: Notification) => {
        presentNotificationToast(notification);
      });

      return () => {
        socket.off('connect');
      };
    }, [userStore.user?.id]);

    return <></>;
  })
);
