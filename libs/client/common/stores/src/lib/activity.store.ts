import { Store } from './store';
import { makeAutoObservable } from 'mobx';
import { http } from '@bregenz-bewegt/client/common/http';

export class ActivityStore implements Store {
  storeKey = 'activityStore' as const;

  constructor() {
    makeAutoObservable(this);
  }

  async startActivity() {
    const { data } = await http.post('/activity/start');
    return data;
  }

  async endActivity() {
    const { data } = await http.post('/activity/end');
    return data;
  }
}

export const activityStore = new ActivityStore();
