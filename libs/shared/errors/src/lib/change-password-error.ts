import { ChangePasswordDto } from '@bregenz-bewegt/shared/types';

export type ChangePasswordErrorResponse = Partial<ChangePasswordDto>;
export enum ChangePasswordError {
  INVALID_PASSWORD = 'INVALID_PASSWORD',
}

export const changePasswordError: {
  [K in ChangePasswordError]: ChangePasswordErrorResponse;
} = {
  [ChangePasswordError.INVALID_PASSWORD]: {
    password: 'Falsches Passwot',
  },
};
