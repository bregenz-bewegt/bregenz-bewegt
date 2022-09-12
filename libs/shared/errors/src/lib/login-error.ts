import { LoginDto } from '@bregenz-bewegt/shared/types';

export type LoginErrorResponse = Partial<LoginDto>;
export enum LoginError {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
}

export const loginError: { [K in LoginError]: LoginErrorResponse } = {
  [LoginError.USER_NOT_FOUND]: {
    email: 'Kein Account mit dieser E-Mail Adresse bekannt',
  },
  [LoginError.INVALID_CREDENTIALS]: {
    email: 'Falsche E-Mail Adresse oder Passwort',
    password: 'Falsche E-Mail Adresse oder Passwort',
  },
  [LoginError.EMAIL_NOT_VERIFIED]: {
    email: 'Email noch nicht bestätigt',
  },
};
