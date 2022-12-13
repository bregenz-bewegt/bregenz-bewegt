import { Store } from './store';
import { action, makeAutoObservable, observable } from 'mobx';
import type { Notification } from '@bregenz-bewegt/client/types';
import { http } from '@bregenz-bewegt/client/common/http';
import { MarkNotificationAsReadDto } from '@bregenz-bewegt/shared/types';

export class NotificationsStore implements Store {
  storeKey = 'notificationsStore' as const;
  @observable notifications: Notification[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  @action setNotifications(notifications: Notification[]): void {
    this.notifications = notifications;
  }

  @action addNotifications(notifications: Notification[]): void {
    this.notifications.push(...notifications);
  }

  @action removeNotification(id: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== id);
  }

  @action async markNotificationAsRead(
    dto: MarkNotificationAsReadDto
  ): Promise<Notification> {
    const { data }: { data: Notification } = await http.patch(
      '/notifications/mark-as-read',
      dto
    );

    return data;
  }

  @action async fetchNotifications(): Promise<Notification[]> {
    const { data }: { data: Notification[] } = await http.get('notifications');

    this.setNotifications(data);
    return data;
  }
}

export const notificationsStore = new NotificationsStore();
