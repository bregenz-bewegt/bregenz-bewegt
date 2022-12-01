import { User } from '@bregenz-bewegt/client/types';

export type FriendRequesteeResult = Pick<
  User,
  'id' | 'username' | 'profilePicture'
>;
