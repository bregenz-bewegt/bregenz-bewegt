import { User } from '@bregenz-bewegt/client/types';

export type FriendSearchResult = Pick<
  User,
  'id' | 'username' | 'profilePicture'
> & { hasConversation: boolean };
