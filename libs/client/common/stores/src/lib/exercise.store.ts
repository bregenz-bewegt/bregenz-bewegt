import { Store } from './store';
import { action, makeAutoObservable, observable } from 'mobx';
import { http } from '@bregenz-bewegt/client/common/http';
import { Exercise } from '@bregenz-bewegt/client/types';

export class ExerciseStore implements Store {
  storeKey = 'exerciseStore' as const;
  @observable exercises: Exercise[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  @action setExercisese(exercises: Exercise[]) {
    this.exercises = exercises;
  }

  @action async getExercise(id: Exercise['id']) {
    try {
      const { data } = await http.get(`exercises/${id}`);
      return data;
    } catch (error) {
      return null;
    }
  }
}

export const exerciseStore = new ExerciseStore();
