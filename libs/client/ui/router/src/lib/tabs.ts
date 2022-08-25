import {
  Start,
  Leaderboard,
  Scan,
  Analytics,
  ParkDetail,
} from '@bregenz-bewegt/client-ui-pages';
import { home, podium, scan, analytics, person } from 'ionicons/icons';

type _TabRoutes = 'start' | 'leaderboard' | 'scan' | 'analytics' | 'profile';

export type TabRoutes = {
  [K in _TabRoutes]: {
    component: React.FC;
    route: string;
    label: string;
    icon: string;
  };
};

export const tabRoutes: TabRoutes = {
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
    component: ParkDetail,
    route: '/profile',
    label: 'Profil',
    icon: person,
  },
};
