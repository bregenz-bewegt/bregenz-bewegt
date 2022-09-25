import { Role, User } from '.prisma/client';

export type JwtPayload<R extends Role = 'USER'> = R extends 'USER'
  ? {
      sub: User['id'];
      email: User['email'];
      role: Role;
    }
  : {
      sub: User['id'];
      role: Role;
    };

export type JwtPayloadWithRefreshToken<R extends Role = 'USER'> =
  JwtPayload<R> & {
    refreshToken: string;
  };
export type JwtPayloadWithoutRole<R extends Role = 'USER'> = Omit<
  JwtPayload<R>,
  'role'
>;
