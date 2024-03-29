import { Preferences } from './preferences';
import { Role } from './role';

export type User = {
  id: string;
  username?: string;
  email?: string;
  active: boolean;
  activationOtp?: string;
  firstname?: string;
  lastname?: string;
  biography?: string;
  role: Role;
  registratedAt: Date;
  updatedAt: Date;
  refreshToken?: string;
  profilePicture?: string;
  coins?: number;
  preferences?: Preferences;
};
