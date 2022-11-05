import {} from 'rxjs';
import { Store } from './store';
import { action, makeAutoObservable, observable } from 'mobx';
import { http } from '@bregenz-bewegt/client/common/http';
import { Exercise, Park } from '@bregenz-bewegt/client/types';
import e from 'express';

export class ParkStore implements Store {
  storeKey = 'parkStore' as const;
  @observable parks: Park[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  @action setParks(parks: Park[]) {
    this.parks = parks;
  }

  @action async getParks(): Promise<Park[] | undefined> {
    try {
      const { data } = await http.get('/parks');
      this.setParks(data);
      return <Park[]>data;
    } catch (error) {
      return;
    }
  }

  async getPark(id: Park['id']): Promise<Park | undefined> {
    try {
      const { data } = await http.get(`/parks/${id}`);
      return data;
    } catch (error) {
      return;
    }
  }

  async getParkWithExercises(id: Park['id']): Promise<Park | undefined> {
    try {
      const { data } = await http.get(`/parks/${id}/exercises`);
      return data;
    } catch (error) {
      return;
    }
  }

  async getParkWithExercise(
    parkId: Park['id'],
    exerciseId: Exercise['id']
  ): Promise<(Park & { exercises: [Exercise] }) | undefined> {
    try {
      const { data } = await http.get(
        `/parks/${parkId}/exercises/${exerciseId}`
      );

      return data;
    } catch (error) {
      return;
    }
  }
}

export const parkStore = new ParkStore();
