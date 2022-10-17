import { User } from '@prisma/client';

export type Leaderboard = Pick<User, 'username' | 'coins'>[];
