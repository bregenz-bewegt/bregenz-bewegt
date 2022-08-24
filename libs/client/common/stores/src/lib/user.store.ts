import { http } from '@bregenz-bewegt/client/common/http';
import { action, makeAutoObservable, observable } from 'mobx';
import { Store } from './store';

export class UserStore implements Store {
  storeKey = 'userStore' as const;
  @observable isLoggedIn = false;

  constructor() {
    makeAutoObservable(this);
  }

  @action setIsLoggedIn(value: boolean) {
    this.isLoggedIn = value;
  }

  @action async register(username: string, email: string, password: string) {
    try {
      const { data } = await http.post('/auth/register', {
        username,
        email,
        password,
      });

      return data;
    } catch (error) {
      return error.response.data;
    }
  }

  @action async login(email: string, password: string) {
    try {
      const { data } = await http.post('/auth/login', {
        email,
        password,
      });

      return data;
    } catch (error) {
      return error.response.data;
    }
  }
}

export const userStore = new UserStore();
