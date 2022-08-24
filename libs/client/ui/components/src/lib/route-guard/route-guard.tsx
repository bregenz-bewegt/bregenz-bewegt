import { UserStore } from '@bregenz-bewegt/client/common/stores';
import { ReactElement, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import './route-guard.scss';

/* eslint-disable-next-line */
export interface RouteGuardProps {
  children: ReactElement<any, any>;
  userStore?: UserStore;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  userStore,
}: RouteGuardProps) => {
  const [isAllowed, setIsAllowed] = useState<boolean>(false);

  useEffect(() => {
    userStore?.isLoggedIn().then((data) => setIsAllowed(data));
  });

  return isAllowed ? children : <Redirect to="/login" />;
};

export default RouteGuard;
