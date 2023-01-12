import { http } from '@bregenz-bewegt/client/common/http';
import { Conversation, User } from '@bregenz-bewegt/client/types';
import { CreateConversationDto } from '@bregenz-bewegt/shared/types';
import { makeAutoObservable } from 'mobx';
import { Store } from './store';

export class ChatStore implements Store {
  storeKey = 'chatStore' as const;

  constructor() {
    makeAutoObservable(this);
  }

  async getConversations(): Promise<
    (Conversation & { participants: User[] })[]
  > {
    const { data } = await http.get('chats/conversations');
    return <(Conversation & { participants: User[] })[]>data;
  }

  async getConversation(id: Conversation['id']): Promise<Conversation> {
    const { data } = await http.get(`chats/conversation/${id}`);
    return <Conversation>data;
  }

  async createConversation(dto: CreateConversationDto): Promise<Conversation> {
    const { data } = await http.post('chats/conversations/create', dto);
    return <Conversation>data;
  }
}

export const chatStore = new ChatStore();
