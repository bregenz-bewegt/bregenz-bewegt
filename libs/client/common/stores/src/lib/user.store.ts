import { http } from '@bregenz-bewegt/client/common/http';
import { storage } from '@bregenz-bewegt/client/common/storage';
import type { Tokens } from '@bregenz-bewegt/shared/types';
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

      this.setTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });
      this.setIsLoggedIn(true);
      return data;
    } catch (error: any) {
      return error.response.data;
    }
  }

  @action async setTokens(tokens: Tokens) {
    await Promise.all(
      Object.entries(tokens).map(([key, value]) => storage.set(key, value))
    );
  }

  @action async getTokens(): Promise<Tokens> {
    const access_token = await storage.get('access_token');
    const refresh_token = await storage.get('refresh_token');

    return { access_token, refresh_token };
  }
}

export const userStore = new UserStore();
