import { Role } from '.prisma/client';

export type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
};

export type JwtPayloadWithRefreshToken = JwtPayload & { refreshToken: string };
export type JwtPayloadWithoutRole = Omit<JwtPayload, 'role'>;
export type JwtPayloadWithoutEmail = Omit<JwtPayload, 'email'>;
