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
    { title: 'test', description: 'test', routerLink: '/start' },
  ];

  constructor() {
    makeAutoObservable(this);
  }

  @action addNotification(value: Notification): void {
    this.notifications.push(value);
  }
}

export const notificationsStore = new NotificationsStore();
