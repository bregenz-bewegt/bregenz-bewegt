import { User } from '@bregenz-bewegt/client/types';
import {
  NotificationClientToServerEvents,
  NotificationServerToClientEvents,
} from '@bregenz-bewegt/shared/types';
import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';

const connectionOptions: Partial<ManagerOptions & SocketOptions> = {
  forceNew: true,
  reconnectionAttempts: 10,
  timeout: 1000,
  transports: ['websocket'],
};

export const connectSocket = (
  userId: User['id']
): Socket<
  NotificationServerToClientEvents,
  NotificationClientToServerEvents
> => {
  return io(`${process.env['NX_API_BASE_URL']}/notifications`, {
    ...connectionOptions,
    auth: { authorization: userId },
  });
};
