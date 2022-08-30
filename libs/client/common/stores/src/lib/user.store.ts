import { http } from '@bregenz-bewegt/client/common/http';
import { storage } from '@bregenz-bewegt/client/common/storage';
import type { User } from '@bregenz-bewegt/client/types';
import type { PatchProfileDto, Tokens } from '@bregenz-bewegt/shared/types';
import { action, makeAutoObservable, observable } from 'mobx';
import { Store } from './store';

export class UserStore implements Store {
  storeKey = 'userStore' as const;
  @observable user?: User;
  @observable isLoggedIn = false;
  @observable isLoadingLoginState = false;

  constructor() {
    makeAutoObservable(this);
  }

  @action async register(username: string, email: string, password: string) {
    const { data } = await http.post('/auth/register', {
      username,
      email,
      password,
    });

    return data;
  }

  @action async login(email: string, password: string) {
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
  }

  @action async logout() {
    try {
      await this.removeTokens();
      this.setIsLoggedIn(false);
    } catch (error) {
      return;
    }
  }

  async fetchProfile() {
    try {
      const { data } = await http.get('/users/profile');

      return data;
    } catch (error) {
      return;
    }
  }

  @action async patchProfile(dto: PatchProfileDto) {
    const { data } = await http.patch('/users/profile', { ...dto });
    this.setUser(data);
    return <User>data;
  }

  @action async editProfilePicture(picture: globalThis.File) {
    const { data } = await http.post(
      '/users/profile-picture',
      {
        file: picture,
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  }

  @action async fetchProfilePicture() {
    try {
      const { data } = await http.get('/users/profile-picture', {
        responseType: 'blob',
      });
      const reader = new window.FileReader();
      reader.readAsDataURL(data);
      reader.onload = () => {
        this.setProfilePicture(`${reader.result}`);
      };
      return reader.result;
    } catch (error) {
      console.log('giegers');
      this.setProfilePicture('https://i.pravatar.cc/150?img=4');
      return;
    }
  }

  @action setIsLoggedIn(value: boolean) {
    this.isLoggedIn = value;
  }

  @action setIsloadingLoginState(value: boolean) {
    this.isLoadingLoginState = value;
  }

  @action async initUser() {
    this.setIsloadingLoginState(true);
    const tokens = await this.getTokens();

    if (tokens.access_token) {
      this.refreshProfile();
      this.setIsLoggedIn(true);
    }
    this.setIsloadingLoginState(false);
  }

  @action async setTokens(tokens: Tokens) {
    await Promise.all(
      Object.entries(tokens).map(([key, value]) => storage.set(key, value))
    );
  }

  @action setUser(user: User) {
    this.user = user;
  }

  @action setProfilePicture(picture: string) {
    if (this.user) {
      this.user.profilePicture = picture;
    }
  }

  @action async refreshProfile() {
    const profile = await this.fetchProfile();
    await this.fetchProfilePicture();
    this.setUser(profile);

    return profile;
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
