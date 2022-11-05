import { User } from '@bregenz-bewegt/client/types';
import { WithCoins } from '../user';

export type Leaderboard = Pick<WithCoins<User>, 'username' | 'coins'>[];
