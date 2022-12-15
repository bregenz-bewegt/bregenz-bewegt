export interface ServerToClientEvents {
  receiveNotification: (notification: Notification) => void;
}
