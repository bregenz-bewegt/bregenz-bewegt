import { Store } from './store';
import { action, makeAutoObservable, observable } from 'mobx';
import type { Notification } from '@bregenz-bewegt/client/types';
import { http } from '@bregenz-bewegt/client/common/http';
import { AllFriendRequests } from '@bregenz-bewegt/shared/types';

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

  @action async fetchNotifications(): Promise<void> {
    const { data }: { data: AllFriendRequests } = await http.get(
      'friends/requests'
    );

    data.received && data.received.length > 0
      ? notificationsStore?.setNotifications(
          data.received.map(
            (r) =>
              ({
                id: r.id,
                title: 'Freundschaftsanfrage',
                description: `${r.requestee.username} hat dir eine Freundschaftsanfrage gesendet`,
                routerLink: `profile/friends`,
              } as Notification)
          )
        )
      : notificationsStore?.setNotifications([]);
  }
}

export const notificationsStore = new NotificationsStore();
