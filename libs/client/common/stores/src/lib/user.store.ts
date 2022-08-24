import { http } from '@bregenz-bewegt/client/common/http';
import { storage } from '@bregenz-bewegt/client/common/storage';
import { Tokens } from '@bregenz-bewegt/shared/types';
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
    } catch (error: any) {
      return error.response.data;
    }
  }

  @action async login(email: string, password: string) {
    try {
      const { data } = await http.post('/auth/login', {
        email,
        password,
      });

      this.setIsLoggedIn(true);
      return data;
    } catch (error: any) {
      return error.response.data;
    }
  }

  @action async setTokens(tokens: Tokens) {
    await storage.set('access_token', tokens.access_token);
    await storage.set('refresh_token', tokens.refresh_token);
  }

  @action async getTokens(): Promise<Tokens> {
    const access_token = await storage.get('access_token');
    const refresh_token = await storage.get('refresh_token');

    return { access_token, refresh_token };
  }
}

export const userStore = new UserStore();
