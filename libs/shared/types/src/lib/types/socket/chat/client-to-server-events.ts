import { CreateMessageDto } from '@bregenz-bewegt/shared/types';

export interface ChatClientToServerEvents {
  'message.create': (
    message: CreateMessageDto,
    cb: (result: any) => void
  ) => void;
}
