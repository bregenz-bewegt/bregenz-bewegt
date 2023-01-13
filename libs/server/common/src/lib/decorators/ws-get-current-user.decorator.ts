import { JwtPayloadWithRefreshToken } from '@bregenz-bewegt/shared/types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const WsGetCurrentUser = createParamDecorator(
  (
    data: keyof JwtPayloadWithRefreshToken | undefined,
    context: ExecutionContext
  ) => {
    const client = context.switchToWs().getClient();
    const wsData = context.switchToWs().getData();
    console.log(client);
    console.log(wsData);

    if (!data) return client.user;
    return client.user[data];
  }
);
