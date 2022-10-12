import { User } from '@prisma/client';

export type Competitor = Pick<User, 'username' | 'coins'>;
