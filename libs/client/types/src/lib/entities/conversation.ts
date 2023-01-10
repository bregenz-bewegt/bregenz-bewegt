import { Message, User } from '.';

export type Conversation = {
  id: string;
  participants: User[];
  createdAt: Date;
  messages: Message[];
};
