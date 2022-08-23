import {
  Start,
  Leaderboard,
  Scan,
  Analytics,
  Profile,
} from '@bregenz-bewegt/client-ui-pages';
import { home, podium, scan, analytics, person } from 'ionicons/icons';

type _Routes = 'start' | 'leaderboard' | 'scan' | 'analytics' | 'profile';

export type Routes = {
  [K in _Routes]: {
    component: React.FC;
    route: string;
    label: string;
    icon: string;
  };
};

export const routes: Routes = {
  start: {
    component: Start,
    route: '/start',
    label: 'Start',
    icon: home,
  },
  leaderboard: {
    component: Leaderboard,
    route: '/leaderboard',
    label: 'Rangliste',
    icon: podium,
  },
  scan: {
    component: Scan,
    route: '/scan',
    label: 'Scan',
    icon: scan,
  },
  analytics: {
    component: Analytics,
    route: '/analytics',
    label: 'Statistik',
    icon: analytics,
  },
  profile: {
    component: Profile,
    route: '/profile',
    label: 'Profil',
    icon: person,
  },
};
