import { Store } from './store';
import { action, makeAutoObservable, observable } from 'mobx';
import { http } from '@bregenz-bewegt/client/common/http';
import { Park } from '@bregenz-bewegt/client/types';

export class ParkStore implements Store {
  storeKey = 'parkStore' as const;
  @observable parks: Park[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  @action setParks(parks: Park[]) {
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

  async getPark(id: Park['id']) {
    try {
      const { data } = await http.get(`/parks/${id}`);
      return data;
    } catch (error) {
      return;
    }
  }
}

export const parkStore = new ParkStore();
