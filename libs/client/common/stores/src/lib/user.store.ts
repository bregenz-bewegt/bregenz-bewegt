import { action, makeAutoObservable, observable } from 'mobx';
import { Store } from './store';

export class UserStore implements Store {
  storeKey = 'userStore' as const;
  @observable isLoggedIn = false;

  constructor() {
    makeAutoObservable(this);
  }

  @action setIsLoggedIn(value: boolean) {
    this.isLoggedIn = value;
  }
}
