import { Store } from './store';
import { action, makeAutoObservable, observable } from 'mobx';
import type { Notification } from '@bregenz-bewegt/client/types';

export class NotificationsStore implements Store {
  storeKey = 'notificationsStore' as const;
  @observable notifications: Notification[] = [];
  @observable read = false;

  constructor() {
    makeAutoObservable(this);
  }

  @action setNotifications(notifications: Notification[]): void {
    this.notifications = notifications;
  }

  @action addNotifications(notifications: Notification[]): void {
    this.notifications.push(...notifications);
    this.setRead(false);
  }

  @action removeNotification(id: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== id);
  }

  @action setRead(value: boolean): void {
    this.read = value;
  }
}

export const notificationsStore = new NotificationsStore();
