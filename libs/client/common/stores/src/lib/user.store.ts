import { http } from '@bregenz-bewegt/client/common/http';
import { storage } from '@bregenz-bewegt/client/common/storage';
import { Preferences, Role } from '@bregenz-bewegt/client/types';
import type { User } from '@bregenz-bewegt/client/types';
import type {
  ForgotPasswordDto,
  GuestDto,
  LoginDto,
  PatchProfileDto,
  PatchPreferencesDto,
  RegisterDto,
  Tokens,
  VerifyDto,
  EmailResetToken,
  ResetEmailDto,
  VerifyResetEmailDto,
} from '@bregenz-bewegt/shared/types';
import { action, makeAutoObservable, observable } from 'mobx';
import { Store } from './store';

export class UserStore implements Store {
  storeKey = 'userStore' as const;
  @observable user?: User;
  @observable isLoggedIn = false;
  @observable isLoadingLoggedIn = false;
  @observable isProfilePictureSet = false;

  constructor() {
    makeAutoObservable(this);
  }

  async guest(dto: GuestDto) {
    const { data } = await http.post('/auth/local/guest', dto);

    await this.setTokens({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });

    return data;
  }

  async register(dto: RegisterDto) {
    const { data } = await http.post('/auth/local/register', dto);
    return data;
  }

  @action async verify(dto: VerifyDto) {
    const { data } = await http.post('/auth/local/verify', dto);

    await this.setTokens({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });

    return data;
  }

  @action async login(dto: LoginDto) {
    const { data } = await http.post('/auth/local/login', dto);

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
    const { data } = await http.patch('/users/profile', dto);
    this.setUser(data);
    return <User>data;
  }

  async deleteProfile() {
    const { data } = await http.delete('/users/profile');
    return data;
  }

  async fetchPreferences() {
    const { data } = await http.get('/users/preferences');
    if (this.user) this.user.preferences = data;
    return <Preferences>data;
  }

  @action async patchPreferences(dto: PatchPreferencesDto) {
    const { data } = await http.patch('/users/preferences', dto);
    if (this.user) this.user.preferences = data;
    return <Preferences>data;
  }

  async editProfilePicture(picture: globalThis.File) {
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

  async removeProfilePicture() {
    if (!this.isProfilePictureSet) return;

    const { data } = await http.delete('/users/profile-picture');
    this.setAvatarProfilePicture();
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
        this.setIsProfilePictureSet(true);
      };
      return reader.result;
    } catch (error) {
      this.setAvatarProfilePicture();
      return;
    }
  }

  @action setIsLoggedIn(value: boolean) {
    this.isLoggedIn = value;
  }

  @action setIsLoadingLoggedIn(value: boolean) {
    this.isLoadingLoggedIn = value;
  }

  @action async initUser() {
    this.setIsLoadingLoggedIn(true);
    const tokens = await this.getTokens();

    if (tokens.access_token) {
      this.refreshProfile();
      this.setIsLoggedIn(true);
    }
    this.setIsLoadingLoggedIn(false);
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

  @action setIsProfilePictureSet(value: boolean) {
    this.isProfilePictureSet = value;
  }

  @action setAvatarProfilePicture() {
    if (this.user) {
      this.user.profilePicture = `https://avatars.dicebear.com/api/initials/${
        this.user.role === Role.USER ? this.user.email : 'BB'
      }.svg`;
      this.setIsProfilePictureSet(false);
    }
  }

  @action async refreshProfile() {
    const profile = await this.fetchProfile();
    this.setUser(profile);
    await this.fetchProfilePicture();

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

  async resetEmail(dto: ResetEmailDto): Promise<EmailResetToken> {
    const { data } = await http.put('/users/email', dto);
    return data;
  }

  async verifyResetEmail(
    dto: VerifyResetEmailDto & { authorization: string }
  ): Promise<User> {
    const { data } = await http.post('/users/email/verify', dto, {
      headers: { authorization: `Bearer ${dto.authorization}` },
    });
    return data;
  }

  async changePassword() {
    const { data } = await http.post('/auth/change-password');
    return data;
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const { data } = await http.post('/auth/forgot-password', dto);
    return data;
  }

  @action async validateResetPassword(resetToken: string) {
    await http.get(`/auth/validate-reset-password`, {
      headers: {
        authorization: `Bearer ${resetToken}`,
      },
    });
  }

  @action async resetPassword(newPassword: string, resetToken: string) {
    await http.post(
      `/auth/reset-password`,
      {
        password: newPassword,
      },
      {
        headers: {
          authorization: `Bearer ${resetToken}`,
        },
      }
    );
  }
}

export const userStore = new UserStore();
