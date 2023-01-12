import { useEffect } from 'react';
import { connectNotificationSocket } from '@bregenz-bewegt/client/common/socket';
import {
  notificationsStore,
  NotificationsStore,
  UserStore,
  userStore,
} from '@bregenz-bewegt/client/common/stores';
import { inject, observer } from 'mobx-react';
import { useIonToast } from '@ionic/react';
import { notifications as notificationIcon, close } from 'ionicons/icons';
import type { Notification } from '@bregenz-bewegt/client/types';
import {
  useDefaultErrorToast,
  useIsGuest,
} from '@bregenz-bewegt/client/common/hooks';

export interface NotificationListenerProps {
  userStore?: UserStore;
  notificationStore?: NotificationsStore;
}

export const NotificationListener: React.FC = inject(
  userStore.storeKey,
  notificationsStore.storeKey
)(
  observer(() => {
    const [presentToast] = useIonToast();
    const [isGuest] = useIsGuest();
    const [presentDefaultErrorToast] = useDefaultErrorToast();

    const presentNotificationToast = (notification: Notification) => {
      presentToast({
        message: notification.description,
        icon: notificationIcon,
        duration: 2000,
        position: 'top',
        mode: 'ios',
        color: 'light',
        buttons: [{ icon: close, role: 'cancel' }],
      });
    };

    const handleFetchNotification = () => {
      if (isGuest) return;

      return notificationsStore?.fetchNotifications().catch(() => {
        presentDefaultErrorToast();
      });
    };

    useEffect(() => {
      if (!userStore.user?.id || isGuest) return;

      const socket = connectNotificationSocket(userStore.user.id);

      socket.on('receiveNotification', (notification: Notification) => {
        presentNotificationToast(notification);
        handleFetchNotification();
      });

      return () => {
        socket.off('connect');
      };
    }, [userStore.user?.id]);

    return <></>;
  })
);
