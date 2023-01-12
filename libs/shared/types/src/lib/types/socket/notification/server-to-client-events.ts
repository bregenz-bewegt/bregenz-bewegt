import { Notification } from '@bregenz-bewegt/client/types';

export interface NotificationServerToClientEvents {
  receiveNotification: (notification: Notification) => void;
}
