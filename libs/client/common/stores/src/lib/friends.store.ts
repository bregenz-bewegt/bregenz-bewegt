import { http } from '@bregenz-bewegt/client/common/http';
import { Friend } from '@bregenz-bewegt/client/types';
import { action, makeAutoObservable, observable } from 'mobx';
import { Store } from './store';

export class FriendsStore implements Store {
  storeKey = 'friendsStore' as const;
  @observable friends: any[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  @action setFriends(value: any[]): void {
    this.friends = value;
  }

  @action async fetchFriends(): Promise<Friend> {
    const { data } = await http.get('/user/friends');
    this.setFriends = data;
    return data;
  }
}

export const friendsStore = new FriendsStore();
