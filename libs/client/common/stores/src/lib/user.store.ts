import { http } from '@bregenz-bewegt/client/common/http';
import { storage } from '@bregenz-bewegt/client/common/storage';
import type { Tokens } from '@bregenz-bewegt/shared/types';
import { action, makeAutoObservable, observable } from 'mobx';
import { Store } from './store';

export class UserStore implements Store {
  storeKey = 'userStore' as const;
  @observable isLoggedIn = false;
  @observable isLoadingLoginState = false;

  constructor() {
    makeAutoObservable(this);
    this.initLoggedIn();
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

      await this.setTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });
      this.setIsLoggedIn(true);
      return data;
    } catch (error: any) {
      return error.response.data;
    }
  }

  @action async logout() {
    try {
      await this.removeTokens();
      this.setIsLoggedIn(false);
    } catch (error) {
      return;
    }
  }

  @action setIsLoggedIn(value: boolean) {
    this.isLoggedIn = value;
  }

  @action setIsloadingLoginState(value: boolean) {
    this.isLoadingLoginState = value;
  }

  async initLoggedIn() {
    this.setIsloadingLoginState(true);
    const tokens = await this.getTokens();

    if (tokens.access_token) this.setIsLoggedIn(true);
    else this.setIsLoggedIn(false);
    this.setIsloadingLoginState(false);
  }

  @action async setTokens(tokens: Tokens) {
    await Promise.all(
      Object.entries(tokens).map(([key, value]) => storage.set(key, value))
    );
  }

  async removeTokens() {
    await Promise.all([
      storage.remove('access_token'),
      storage.remove('refresh_token'),
    ]);
  }

  async getTokens(): Promise<Tokens> {
    const access_token = await storage.get('access_token');
    const refresh_token = await storage.get('refresh_token');

    return { access_token, refresh_token };
  }
}

export const userStore = new UserStore();
