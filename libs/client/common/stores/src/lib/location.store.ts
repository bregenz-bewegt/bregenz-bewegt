import type { GeographicCoordinates } from '@bregenz-bewegt/client/types';
import { action, makeAutoObservable, observable } from 'mobx';
import { Store } from './store';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import * as geolib from 'geolib';

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

  isLocationWithinRadius(
    point: GeographicCoordinates,
    center: GeographicCoordinates,
    radiusInMeter: number
  ): ReturnType<typeof geolib['isPointWithinRadius']> {
    return geolib.isPointWithinRadius(
      { latitude: point.latitude, longitude: point.longitude },
      { latitude: center.latitude, longitude: center.longitude },
      radiusInMeter
    );
  }
}

export const locationStore = new LocationStore();
