import { IStore } from './store';
import { action, observable } from 'mobx';

export class ParkStore implements IStore {
  storeKey = 'parkStore' as const;
  @observable count = 0;

  constructor() {
    //
  }

  @action increase() {
    this.count += 1;
  }
}

export const parkStore = new ParkStore();
