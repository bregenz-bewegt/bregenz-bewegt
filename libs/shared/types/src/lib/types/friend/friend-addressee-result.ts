import { User } from '@bregenz-bewegt/client/types';

export type FriendAdresseeResult = Pick<
  User,
  'id' | 'username' | 'profilePicture'
>;
