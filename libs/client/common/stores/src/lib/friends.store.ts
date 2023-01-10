import { http } from '@bregenz-bewegt/client/common/http';
import { Friend, FriendRequest } from '@bregenz-bewegt/client/types';
import {
  AcceptFriendRequestDto,
  AllFriendRequests,
  CreateFriendRequestDto,
  UserSearchResult,
  RejectFriendRequestDto,
  RemoveFriendDto,
  RevokeFriendRequestDto,
  SearchUserQueryDto,
} from '@bregenz-bewegt/shared/types';
import { action, makeAutoObservable } from 'mobx';
import { Store } from './store';

export class FriendsStore implements Store {
  storeKey = 'friendsStore' as const;

  constructor() {
    makeAutoObservable(this);
  }

  @action async fetchFriends(): Promise<Friend[]> {
    const { data } = await http.get('/friends');
    return data;
  }

  async searchUser(params: SearchUserQueryDto): Promise<UserSearchResult[]> {
    const { data } = await http.get('friends/search-user', { params });
    return data;
  }

  async searchFriend(params: SearchUserQueryDto): Promise<UserSearchResult[]> {
    const { data } = await http.get('friends/search', { params });
    return data;
  }

  async sendFriendRequest(dto: CreateFriendRequestDto): Promise<FriendRequest> {
    const { data } = await http.post('friends/request', dto);
    return data;
  }

  async getAllFriendRequests(): Promise<AllFriendRequests> {
    const { data } = await http.get('friends/requests');
    return data;
  }

  async revokeFriendRequest(
    dto: RevokeFriendRequestDto
  ): Promise<FriendRequest> {
    const { data } = await http.post('friends/requests/revoke', dto);
    return data;
  }

  async acceptFriendRequest(
    dto: AcceptFriendRequestDto
  ): Promise<FriendRequest> {
    const { data } = await http.post('friends/requests/accept', dto);
    return data;
  }

  async rejectFriendRequest(
    dto: RejectFriendRequestDto
  ): Promise<FriendRequest> {
    const { data } = await http.post('friends/requests/reject', dto);
    return data;
  }

  async removeFriend(dto: RemoveFriendDto): Promise<Friend> {
    const { data } = await http.delete('friends/remove', { data: dto });
    return data;
  }
}

export const friendsStore = new FriendsStore();
