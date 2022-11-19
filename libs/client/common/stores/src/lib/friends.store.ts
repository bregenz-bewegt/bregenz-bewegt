import { http } from '@bregenz-bewegt/client/common/http';
import { Friend } from '@bregenz-bewegt/client/types';
import {
  AcceptFriendRequestDto,
  AllFriendRequests,
  CreateFriendRequestDto,
  FriendSearchResult,
  RejectFriendRequestDto,
  RevokeFriendRequestDto,
  SearchUserQueryDto,
} from '@bregenz-bewegt/shared/types';
import { action, makeAutoObservable, observable } from 'mobx';
import { Store } from './store';

export class FriendsStore implements Store {
  storeKey = 'friendsStore' as const;
  @observable friends: any[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  @action setFriends(value: any[]): void {
    this.friends = value;
  }

  @action async fetchFriends(): Promise<Friend[]> {
    const { data } = await http.get('/friends');
    this.setFriends = data;
    return data;
  }

  async searchUser(params: SearchUserQueryDto): Promise<FriendSearchResult[]> {
    const { data } = await http.get('friends/search', { params });
    return data;
  }

  async sendFriendRequest(dto: CreateFriendRequestDto): Promise<any> {
    const { data } = await http.post('friends/request', dto);
    return data;
  }

  async getAllFriendRequests(): Promise<AllFriendRequests> {
    const { data } = await http.get('friends/requests');
    return data;
  }

  async revokeFriendRequest(dto: RevokeFriendRequestDto): Promise<void> {
    const { data } = await http.post('friends/requests/revoke', dto);
    return data;
  }

  async acceptFriendRequest(dto: AcceptFriendRequestDto): Promise<void> {
    const { data } = await http.post('friends/requests/accept', dto);
    return data;
  }

  async rejectFriendRequest(dto: RejectFriendRequestDto): Promise<void> {
    const { data } = await http.post('friends/requests/reject', dto);
    return data;
  }
}

export const friendsStore = new FriendsStore();
