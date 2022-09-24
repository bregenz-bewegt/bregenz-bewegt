import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const HasRole = (...allowedRoles: Role[]) =>
  SetMetadata(ROLES_KEY, allowedRoles);
