import { Message } from '@bregenz-bewegt/client/types';
import { CreateMessageDto } from '@bregenz-bewegt/shared/types';

export interface ChatClientToServerEvents {
  'message.create': (
    message: CreateMessageDto,
    cb: (result: Message) => void
  ) => void;
}
