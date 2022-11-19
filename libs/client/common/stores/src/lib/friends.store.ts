import { http } from '@bregenz-bewegt/client/common/http';
import { Friend } from '@bregenz-bewegt/client/types';
import {
  AllFriendRequests,
  CreateFriendRequestDto,
  FriendSearchResult,
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
    const { data } = await http.get('/users/friends');
    this.setFriends = data;
    return data;
  }

  async searchUser(params: SearchUserQueryDto): Promise<FriendSearchResult[]> {
    const { data } = await http.get('users/friends/search', { params });
    return data;
  }

  async sendFriendRequest(dto: CreateFriendRequestDto): Promise<any> {
    const { data } = await http.post('users/friends/request', dto);
    return data;
  }

  async getAllFriendRequests(): Promise<AllFriendRequests> {
    const { data } = await http.get('users/friends/requests');
    return data;
  }
}

export const friendsStore = new FriendsStore();
