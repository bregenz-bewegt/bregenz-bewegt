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

  private avatarApiBaseUrl =
    'https://avatars.dicebear.com/api/initials' as const;

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
    const { data } = await http.put(
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

    await this.refreshProfile();
    return data;
  }

  async removeProfilePicture(): Promise<User | undefined> {
    if (!this.isProfilePictureSet) return;

    const { data } = await http.delete('/users/profile-picture');
    this.setAvatarProfilePicture();
    return data;
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

    if (user.profilePicture) {
      this.setProfilePicture(this.getProfilePictureUrl(user.profilePicture));
      this.setIsProfilePictureSet(true);
    } else {
      this.setAvatarProfilePicture();
      this.setIsProfilePictureSet(false);
    }
  }

  @action setProfilePicture(picture: string): void {
    if (this.user) {
      this.user.profilePicture = picture;
    }
  }

  getProfilePictureUrl(image: string): string {
    return `${process.env['NX_API_BASE_URL']}/static/${process.env['NX_UPLOADS_FOLDER']}/profile-pictures/${image}`;
  }

  @action setIsProfilePictureSet(value: boolean): void {
    this.isProfilePictureSet = value;
  }

  @action setAvatarProfilePicture(): void {
    if (this.user) {
      this.user.profilePicture = this.getAvatarProfilePictureUrl(
        this.user.role === Role.USER ? this.user.username : undefined
      );
      this.setIsProfilePictureSet(false);
    }
  }

  getAvatarProfilePictureUrl(seed?: string): string {
    return `${this.avatarApiBaseUrl}/${
      seed ?? 'BB'
    }.svg?backgroundColorLevel=600`;
  }

  @action async refreshProfile(): Promise<any> {
    const profile = await this.fetchProfile();
    this.setUser(profile);

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

  async changePassword(dto: ChangePasswordDto): Promise<User> {
    const { data } = await http.put('/auth/change-password', dto);
    return data;
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
