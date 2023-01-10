import { http } from '@bregenz-bewegt/client/common/http';
import { Conversation } from '@bregenz-bewegt/client/types';
import { CreateConversationDto } from '@bregenz-bewegt/shared/types';
import { makeAutoObservable } from 'mobx';
import { Store } from './store';

export class ChatStore implements Store {
  storeKey = 'chatStore' as const;

  constructor() {
    makeAutoObservable(this);
  }

  async createConversation(dto: CreateConversationDto): Promise<Conversation> {
    const { data } = await http.post('chats/conversations/create', dto);
    return <Conversation>data;
  }
}
