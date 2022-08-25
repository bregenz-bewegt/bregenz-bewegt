import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import { inject, observer } from 'mobx-react';
import { ReactElement } from 'react';
import { Redirect } from 'react-router-dom';
import './route-guard.scss';

export interface RouteGuardProps {
  children: ReactElement;
  userStore?: UserStore;
}

export const RouteGuard: React.FC<RouteGuardProps> = inject(userStore.storeKey)(
  observer(({ children, userStore }: RouteGuardProps) => {
    return userStore?.isLoggedIn ? children : <Redirect to="/login" />;
  })
);

export default RouteGuard;
