import { User } from '@bregenz-bewegt/client/types';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@bregenz-bewegt/shared/types';
import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';

const connectionOptions: Partial<ManagerOptions & SocketOptions> = {
  forceNew: true,
  reconnectionAttempts: Infinity,
  timeout: 1000,
  transports: ['websocket'],
};

export const connectSocket = (
  userId: User['id']
): Socket<ServerToClientEvents, ClientToServerEvents> => {
  return io(`${process.env['NX_API_BASE_URL']}`, {
    ...connectionOptions,
    auth: { authorization: userId },
  });
};
