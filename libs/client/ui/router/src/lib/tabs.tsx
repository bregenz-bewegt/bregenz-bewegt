import {
  Start,
  Leaderboard,
  Scan,
  Analytics,
  Profile,
} from '@bregenz-bewegt/client-ui-pages';
import {
  Home2,
  ScanBarcode,
  Diagram,
  Profile as ProfileIcon,
  MedalStar,
} from 'iconsax-react';

export type TabRoutes =
  | 'start'
  | 'leaderboard'
  | 'scan'
  | 'analytics'
  | 'profile';

export type Tabs = {
  [K in TabRoutes]: {
    component: React.FC;
    route: string;
    label: string;
    icon: React.FC;
  };
};

export const tabRoutes: Tabs = {
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
    icon: () => <MedalStar variant="Bold" size={32} />,
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
    icon: () => <Diagram variant="Bold" size={24} />,
  },
  profile: {
    component: Profile,
    route: '/profile',
    label: 'Profil',
    icon: () => <ProfileIcon variant="Bold" size={32} />,
  },
};
