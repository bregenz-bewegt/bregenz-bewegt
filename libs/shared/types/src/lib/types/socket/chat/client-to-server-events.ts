import { CreateMessageDto } from '@bregenz-bewegt/shared/types';

export interface ChatClientToServerEvents {
  createMessage: (message: CreateMessageDto, cb: (result: any) => void) => void;
}
