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
}

export const friendsStore = new FriendsStore();
