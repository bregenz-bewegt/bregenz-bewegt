import { Role } from './role';

export type User = {
  id: string;
  username?: string;
  email?: string;
  active: boolean;
  activationOtp?: string;
  firstname?: string;
  lastname?: string;
  role: Role;
  registratedAt: Date;
  updatedAt: Date;
  refreshToken?: string;
  profilePicture?: string;
  coins?: number;
};
