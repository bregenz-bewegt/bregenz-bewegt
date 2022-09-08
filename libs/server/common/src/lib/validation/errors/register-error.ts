import { RegisterDto } from '@bregenz-bewegt/shared/types';

export type RegisterErrorResponse = Partial<RegisterDto>;
export enum RegisterError {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USERNAME_TAKEN = 'USERNAME_TAKEN',
  EMAIL_TAKEN = 'EMAIL_TAKEN',
}

export const registerError: { [K in RegisterError]: RegisterErrorResponse } = {
  [RegisterError.USER_NOT_FOUND]: {
    email: 'Kein Account mit dieser E-Mail Adresse bekannt',
  },
  [RegisterError.INVALID_CREDENTIALS]: {
    email: 'Falsche E-Mail Adresse oder Passwort',
    password: 'Falsche E-Mail Adresse oder Passwort',
  },
  [RegisterError.USERNAME_TAKEN]: {
    username: 'Benutzername bereits vergeben',
  },
  [RegisterError.EMAIL_TAKEN]: {
    email: 'E-Mail Adresse wird bereits verwendet',
  },
};
