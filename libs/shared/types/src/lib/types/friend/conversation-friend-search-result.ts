import { User } from '@bregenz-bewegt/client/types';

export type ConversationFriendSearchResult = Pick<
  User,
  'id' | 'username' | 'profilePicture'
> & { hasConversation: boolean };
