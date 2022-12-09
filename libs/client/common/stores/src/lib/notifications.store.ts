import { Store } from './store';
import { action, makeAutoObservable, observable } from 'mobx';
import type { Notification } from '@bregenz-bewegt/client/types';

export class NotificationsStore implements Store {
  storeKey = 'notificationsStore' as const;
  @observable notifications: Notification[] = [
    { title: '1', description: 'test', routerLink: '/start' },
    { title: '2', description: 'test', routerLink: '/start' },
    { title: '3', description: 'test', routerLink: '/start' },
    { title: '4', description: 'test', routerLink: '/start' },
    { title: '5', description: 'test', routerLink: '/start' },
  ];
  @observable read = false;

  constructor() {
    makeAutoObservable(this);
  }

  @action setNotifications(notifications: Notification[]): void {
    this.notifications = notifications;
  }

  @action addNotification(value: Notification): void {
    this.notifications.push(value);
    this.setRead(false);
  }

  @action removeNotification(id: number): void {
    this.notifications.splice(id, 1);
  }

  @action setRead(value: boolean): void {
    this.read = value;
  }
}

export const notificationsStore = new NotificationsStore();
