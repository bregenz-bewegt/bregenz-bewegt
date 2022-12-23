import { Notification } from '@bregenz-bewegt/client/types';

export interface ServerToClientEvents {
  receiveNotification: (notification: Notification) => void;
}
