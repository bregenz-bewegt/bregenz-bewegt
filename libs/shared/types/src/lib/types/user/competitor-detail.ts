import { Preferences, User } from '@bregenz-bewegt/client/types';

export type CompetitorDetail = Omit<User, 'id' | 'email'> & {
  preferences: Preferences;
};
