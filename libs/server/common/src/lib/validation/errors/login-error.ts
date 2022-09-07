import { LoginCredentials } from '@bregenz-bewegt/client/types';

export type LoginErrorResponse = Partial<LoginCredentials>;
export enum LoginError {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
}

export const loginError: { [K in LoginError]: LoginErrorResponse } = {
  [LoginError.USER_NOT_FOUND]: {
    email: 'Kein Account mit dieser E-Mail Adresse bekannt',
  },
  [LoginError.INVALID_CREDENTIALS]: {
    email: 'Falsche E-Mail Adresse oder Passwort',
    password: 'Falsche E-Mail Adresse oder Passwort',
  },
};
