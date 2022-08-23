import { Store } from './store';
import { action, makeAutoObservable, observable } from 'mobx';
import { http } from '@bregenz-bewegt/client/common/http';

export class ParkStore implements Store {
  storeKey = 'parkStore' as const;
  @observable parks: any[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  @action setParks(parks: any[]) {
    this.parks = parks;
  }

  @action async fetchParks() {
    try {
      const { data } = await http.get('/parks');
      this.setParks(data);
      return data;
    } catch (error) {
      return;
    }
  }
}

export const parkStore = new ParkStore();
