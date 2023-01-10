import { Conversation, User } from '.';

export type Message = {
  id: string;
  text: string;
  conversation: Conversation;
  author: User;
  createdAt: Date;
};
