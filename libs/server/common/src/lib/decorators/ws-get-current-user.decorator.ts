import { JwtPayloadWithRefreshToken } from '@bregenz-bewegt/shared/types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const WsGetCurrentUser = createParamDecorator(
  (
    data: keyof JwtPayloadWithRefreshToken | undefined,
    context: ExecutionContext
  ) => {
    const client = context.switchToWs().getClient();

    if (!data) return client.user;
    return client.user[data];
  }
);
