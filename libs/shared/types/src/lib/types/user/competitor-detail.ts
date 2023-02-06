import { Preferences, User } from '@bregenz-bewegt/client/types';
import { FriendRequest } from '@prisma/client';

export type CompetitorDetail = Omit<User, 'email'> & {
  preferences: Preferences;
  friendRequestsRelation: FriendRequest[];
};
