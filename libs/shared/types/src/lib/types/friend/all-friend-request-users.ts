import { FriendRequest } from '@bregenz-bewegt/client/types';
import { FriendAdresseeResult } from './friend-addressee-result';
import { FriendRequesteeResult } from './friend-requestee-result';

export type AllFriendRequests = {
  requested: (FriendRequest & { addressee: FriendAdresseeResult })[];
  received: (FriendRequest & { requestee: FriendRequesteeResult })[];
};
