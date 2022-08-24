import { http } from '@bregenz-bewegt/client/common/http';
import { action, makeAutoObservable, observable } from 'mobx';
import { Store } from './store';

export class UserStore implements Store {
  storeKey = 'userStore' as const;
  @observable isLoggedIn = true;

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

      console.log(data);
    } catch (error) {
      return;
    }
  }

  @action async login(email: string, password: string) {
    try {
      const { data } = await http.post('/auth/login', {
        email,
        password,
      });

      console.log(data);
    } catch (error) {
      return;
    }
  }
}

export const userStore = new UserStore();
