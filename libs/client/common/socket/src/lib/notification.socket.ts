import { User } from '@bregenz-bewegt/client/types';
import {
  NotificationClientToServerEvents,
  NotificationServerToClientEvents,
} from '@bregenz-bewegt/shared/types';
import { io, Socket } from 'socket.io-client';
import { connectionOptions } from '.';

export const connectNotificationSocket = (
  userId: User['id']
): Socket<
  NotificationServerToClientEvents,
  NotificationClientToServerEvents
> => {
  return io(`${process.env['NX_API_BASE_URL']}/api/notifications`, {
    ...connectionOptions,
    auth: { authorization: userId },
  });
};
