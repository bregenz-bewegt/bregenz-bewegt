import { ReactNode } from 'react';
import { Provider } from 'mobx-react';

import {
  parkStore,
  userStore,
  exerciseStore,
  activityStore,
  tabStore,
  onboardingStore,
  themeStore,
  leaderboardStore,
} from '@bregenz-bewegt/client/common/stores';

const stores = {
  parkStore,
  userStore,
  exerciseStore,
  activityStore,
  tabStore,
  onboardingStore,
  themeStore,
  leaderboardStore,
};

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  return <Provider {...stores}>{children}</Provider>;
};
