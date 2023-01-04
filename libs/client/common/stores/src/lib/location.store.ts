import { GeographicCoordinates } from '@bregenz-bewegt/client/types';
import { action, makeAutoObservable, observable } from 'mobx';
import { Store } from './store';

export class LocationStore implements Store {
  storeKey = `locationStore` as const;
  @observable coordinates: GeographicCoordinates;

  constructor() {
    makeAutoObservable(this);
  }

  @action setCoordinates(value: GeographicCoordinates): void {
    this.coordinates = value;
  }
}

export const locationStore = new LocationStore();
