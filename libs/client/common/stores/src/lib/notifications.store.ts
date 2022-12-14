import { Store } from './store';
import { action, makeAutoObservable, observable } from 'mobx';
import type { Notification } from '@bregenz-bewegt/client/types';
import { http } from '@bregenz-bewegt/client/common/http';
import {
  DeleteNotificationDto,
  MarkNotificationAsReadDto,
  MarkNotificationAsUnreadDto,
} from '@bregenz-bewegt/shared/types';

export class NotificationsStore implements Store {
  storeKey = 'notificationsStore' as const;
  @observable notifications: Notification[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  @action setNotifications(notifications: Notification[]): void {
    this.notifications = notifications;
  }

  getUnreadNotifications(): Notification[] {
    return this.notifications.filter((n) => !n.read);
  }

  @action async fetchNotifications(): Promise<Notification[]> {
    const { data }: { data: Notification[] } = await http.get('notifications');

    console.log(data);

    this.setNotifications(data);
    return data;
  }

  async deleteNotification(dto: DeleteNotificationDto): Promise<Notification> {
    const { data }: { data: Notification } = await http.delete(
      '/notifications/notification',
      { data: dto }
    );

    return data;
  }

  async markNotificationAsRead(
    dto: MarkNotificationAsReadDto
  ): Promise<Notification> {
    const { data }: { data: Notification } = await http.patch(
      '/notifications/mark-as-read',
      dto
    );

    return data;
  }

  async markNotificationAsUnread(
    dto: MarkNotificationAsUnreadDto
  ): Promise<Notification> {
    const { data }: { data: Notification } = await http.patch(
      '/notifications/mark-as-unread',
      dto
    );

    return data;
  }
}

export const notificationsStore = new NotificationsStore();
