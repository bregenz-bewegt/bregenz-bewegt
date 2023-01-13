import { ManagerOptions, SocketOptions } from 'socket.io-client';

export const connectionOptions: Partial<ManagerOptions & SocketOptions> = {
  forceNew: true,
  reconnectionAttempts: 10,
  timeout: 1000,
  // transports: ['websocket', 'polling'],
};
