import { LoginCredentials } from '@bregenz-bewegt/client/types';

export type LoginError = LoginCredentials;
export const defaultLoginError: LoginError = {
  email: 'Falsche E-Mail Adresse oder Passwort',
  password: 'Falsche E-Mail Adresse oder Passwort',
};
