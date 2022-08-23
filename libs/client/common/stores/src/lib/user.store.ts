import { makeAutoObservable } from 'mobx';
import { Store } from './store';

export class UserStore implements Store {
  storeKey = 'userStore' as const;

  constructor() {
    makeAutoObservable(this);
  }
}
