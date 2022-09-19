import { Store } from './store';
import { action, makeAutoObservable, observable } from 'mobx';

export class TabStore implements Store {
  storeKey = 'tabStore' as const;
  @observable isShown = true;

  constructor() {
    makeAutoObservable(this);
  }

  @action setIsShown(value: boolean) {
    this.isShown = value;
  }
}

export const tabStore = new TabStore();
