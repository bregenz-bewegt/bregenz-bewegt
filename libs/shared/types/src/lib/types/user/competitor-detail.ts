import { User } from '@prisma/client';

export type CompetitorDetail = Omit<User, 'id' | 'email'>;
