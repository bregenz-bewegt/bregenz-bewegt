import { Store } from './store';
import { makeAutoObservable } from 'mobx';

export class ActivityStore implements Store {
  storeKey = 'activityStore' as const;

  constructor() {
    makeAutoObservable(this);
  }
}

export const activityStore = new ActivityStore();
