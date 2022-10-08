import {
  Start,
  Leaderboard,
  Scan,
  Analytics,
  Profile,
} from '@bregenz-bewegt/client-ui-pages';
import {
  Home2,
  Ranking,
  ScanBarcode,
  Chart21,
  Profile as ProfileIcon,
} from 'iconsax-react';

export type _TabRoutes =
  | 'start'
  | 'leaderboard'
  | 'scan'
  | 'analytics'
  | 'profile';

export type TabRoutes = {
  [K in _TabRoutes]: {
    component: React.FC;
    route: string;
    label: string;
    icon: React.FC;
  };
};

export const tabRoutes: TabRoutes = {
  start: {
    component: Start,
    route: '/start',
    label: 'Start',
    icon: () => <Home2 variant="Bold" size={32} />,
  },
  leaderboard: {
    component: Leaderboard,
    route: '/leaderboard',
    label: 'Rangliste',
    icon: () => <Ranking variant="Bold" size={32} />,
  },
  scan: {
    component: Scan,
    route: '/scan',
    label: 'Scan',
    icon: () => <ScanBarcode variant="Bold" />,
  },
  analytics: {
    component: Analytics,
    route: '/analytics',
    label: 'Statistik',
    icon: () => <Chart21 variant="Bold" size={32} />,
  },
  profile: {
    component: Profile,
    route: '/profile',
    label: 'Profil',
    icon: () => <ProfileIcon variant="Bold" size={32} />,
  },
};
