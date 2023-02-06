import { Preferences, User } from '@bregenz-bewegt/client/types';

export type CompetitorDetail = Omit<User, 'email'> & {
  preferences: Preferences;
};
