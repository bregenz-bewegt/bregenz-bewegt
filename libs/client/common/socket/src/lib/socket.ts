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
  path: 'notification-gateway',
};

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  `${process.env['NX_API_BASE_URL']}/api`,
  connectionOptions
);
