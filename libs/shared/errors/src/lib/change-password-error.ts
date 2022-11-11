import { ChangePasswordDto } from '@bregenz-bewegt/shared/types';

export type ChangePasswordErrorResponse = Partial<ChangePasswordDto>;
export enum ChangePasswordError {
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  PASSWORD_NOT_CHANGED = 'PASSWORD_NOT_CHANGED',
}

export const changePasswordError: {
  [K in ChangePasswordError]: ChangePasswordErrorResponse;
} = {
  [ChangePasswordError.INVALID_PASSWORD]: {
    password: 'Falsches Passwot',
  },
  [ChangePasswordError.PASSWORD_NOT_CHANGED]: {
    newPassword: 'Neues Passwort entspricht dem alten Passwort',
  },
};
