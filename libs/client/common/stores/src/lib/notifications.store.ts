import { Store } from './store';
import { action, makeAutoObservable, observable } from 'mobx';
import type { Notification } from '@bregenz-bewegt/client/types';

export class NotificationsStore implements Store {
  storeKey = 'notificationsStore' as const;
  @observable notifications: Notification[] = [
    { title: 'test', description: 'test', routerLink: '/start' },
    { title: 'test', description: 'test', routerLink: '/start' },
    { title: 'test', description: 'test', routerLink: '/start' },
    { title: 'test', description: 'test', routerLink: '/start' },
    { title: 'test', description: 'test', routerLink: '/start' },
  ];
  @observable read = false;

  constructor() {
    makeAutoObservable(this);
  }

  @action addNotification(value: Notification): void {
    this.notifications.push(value);
    this.setRead(false);
  }

  @action setRead(value: boolean): void {
    this.read = value;
  }
}

export const notificationsStore = new NotificationsStore();
