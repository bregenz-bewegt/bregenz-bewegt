import { User } from '@bregenz-bewegt/client/types';

export type UserSearchResult = Pick<
  User,
  'id' | 'username' | 'profilePicture'
> & { isRequested: boolean };
