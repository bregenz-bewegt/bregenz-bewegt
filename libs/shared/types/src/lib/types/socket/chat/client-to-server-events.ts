import { CreateMessageDto } from '@bregenz-bewegt/shared/types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ChatClientToServerEvents {
  createMessage: (message: CreateMessageDto) => void;
}
