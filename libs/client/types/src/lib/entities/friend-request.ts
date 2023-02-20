export type FriendRequest = {
  id: string;
  createdAt: Date;
  acceptedAt?: Date;
  addresseeId: string;
  requesteeId: string;
};
