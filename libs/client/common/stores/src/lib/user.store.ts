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
  ChangePasswordDto,
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

  async guest(dto: GuestDto): Promise<Tokens> {
    const { data } = await http.post('/auth/local/guest', dto);

    await this.setTokens({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });

    return data;
  }

  async register(dto: RegisterDto): Promise<void> {
    await http.post('/auth/local/register', dto);
  }

  @action async verify(dto: VerifyDto): Promise<Tokens> {
    const { data } = await http.post('/auth/local/verify', dto);

    await this.setTokens({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });

    return data;
  }

  @action async login(dto: LoginDto): Promise<Tokens> {
    const { data } = await http.post('/auth/local/login', dto);

    await this.setTokens({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });
    this.setIsLoggedIn(true);

    return data;
  }

  @action async logout(): Promise<void> {
    await this.removeTokens();
    this.setIsLoggedIn(false);
  }

  async fetchProfile(): Promise<User> {
    const { data } = await http.get('/users/profile');
    return data;
  }

  @action async patchProfile(dto: PatchProfileDto): Promise<User> {
    const { data } = await http.patch('/users/profile', dto);
    this.setUser(data);
    return data;
  }

  async deleteProfile(): Promise<User> {
    const { data } = await http.delete('/users/profile');
    return data;
  }

  async fetchPreferences(): Promise<Preferences> {
    const { data } = await http.get('/users/preferences');
    if (this.user) this.user.preferences = data;
    return data;
  }

  @action async patchPreferences(
    dto: PatchPreferencesDto
  ): Promise<Preferences> {
    const { data } = await http.patch('/users/preferences', dto);
    if (this.user) this.user.preferences = data;
    return data;
  }

  async editProfilePicture(picture: globalThis.File): Promise<User> {
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

  async removeProfilePicture(): Promise<User | undefined> {
    if (!this.isProfilePictureSet) return;

    const { data } = await http.delete('/users/profile-picture');
    this.setAvatarProfilePicture();
    return data;
  }

  @action async fetchProfilePicture(): Promise<
    string | ArrayBuffer | null | undefined
  > {
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

  @action setIsLoggedIn(value: boolean): void {
    this.isLoggedIn = value;
  }

  @action setIsLoadingLoggedIn(value: boolean): void {
    this.isLoadingLoggedIn = value;
  }

  @action async initUser(): Promise<void> {
    this.setIsLoadingLoggedIn(true);
    const tokens = await this.getTokens();

    if (tokens.access_token) {
      this.refreshProfile();
      this.setIsLoggedIn(true);
    }
    this.setIsLoadingLoggedIn(false);
  }

  @action async setTokens(tokens: Tokens): Promise<void> {
    await Promise.all(
      Object.entries(tokens).map(([key, value]) => storage.set(key, value))
    );
  }

  @action setUser(user: User): void {
    this.user = user;
  }

  @action setProfilePicture(picture: string): void {
    if (this.user) {
      this.user.profilePicture = picture;
    }
  }

  @action setIsProfilePictureSet(value: boolean): void {
    this.isProfilePictureSet = value;
  }

  @action setAvatarProfilePicture(): void {
    if (this.user) {
      this.user.profilePicture = `https://avatars.dicebear.com/api/initials/${
        this.user.role === Role.USER ? this.user.email : 'BB'
      }.svg`;
      this.setIsProfilePictureSet(false);
    }
  }

  @action async refreshProfile(): Promise<any> {
    const profile = await this.fetchProfile();
    this.setUser(profile);
    await this.fetchProfilePicture();

    return profile;
  }

  async removeTokens(): Promise<void> {
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

  async changePassword(dto: ChangePasswordDto): Promise<void> {
    await http.put('/auth/change-password', dto);
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    await http.post('/auth/forgot-password', dto);
  }

  @action async validateResetPassword(resetToken: string): Promise<void> {
    await http.get(`/auth/validate-reset-password`, {
      headers: {
        authorization: `Bearer ${resetToken}`,
      },
    });
  }

  @action async resetPassword(
    newPassword: string,
    resetToken: string
  ): Promise<void> {
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
