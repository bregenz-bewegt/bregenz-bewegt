import type { GeographicCoordinates } from '@bregenz-bewegt/client/types';
import { action, makeAutoObservable, observable } from 'mobx';
import { Store } from './store';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';

export class LocationStore implements Store {
  storeKey = `locationStore` as const;
  @observable coordinates: GeographicCoordinates;

  constructor() {
    makeAutoObservable(this);
  }

  @action setCoordinates(value: GeographicCoordinates): void {
    this.coordinates = value;
  }

  async getLocation(): Promise<Geoposition | undefined> {
    try {
      const location = await Geolocation.getCurrentPosition();
      this.setCoordinates(location.coords);
      return location;
    } catch (error) {
      return undefined;
    }
  }
}

export const locationStore = new LocationStore();
