import { Store } from './store';
import { action, makeAutoObservable, observable } from 'mobx';
import { Notification } from '@bregenz-bewegt/client/types';

export class NotificationsStore implements Store {
  storeKey = 'notificationsStore' as const;
  @observable notifications: Notification[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  @action addNotification(value: Notification): void {
    this.notifications.push(value);
  }
}

export const notificationsStore = new NotificationsStore();
