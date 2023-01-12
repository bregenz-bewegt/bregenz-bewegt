import { Message } from '@bregenz-bewegt/client/types';

export interface ChatServerToClientEvents {
  onCreateMessage: (message: Message) => void;
}
