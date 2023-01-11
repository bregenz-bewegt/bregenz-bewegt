import {
  ChatClientToServerEvents,
  ChatServerToClientEvents,
} from '@bregenz-bewegt/shared/types';
import { io, Socket } from 'socket.io-client';
import { connectionOptions } from '.';

export const connectChatSocket = (): Socket<
  ChatServerToClientEvents,
  ChatClientToServerEvents
> => {
  return io(`${process.env['NX_API_BASE_URL']}/chats`, {
    ...connectionOptions,
  });
};
