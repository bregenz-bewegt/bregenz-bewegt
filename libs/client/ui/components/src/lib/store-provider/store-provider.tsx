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
} from '@bregenz-bewegt/client/common/stores';

const stores = {
  parkStore,
  userStore,
  exerciseStore,
  activityStore,
  tabStore,
  onboardingStore,
  themeStore,
};

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  return <Provider {...stores}>{children}</Provider>;
};
