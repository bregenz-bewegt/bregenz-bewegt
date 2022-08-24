import { UserStore } from '@bregenz-bewegt/client/common/stores';
import { ReactElement, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import './route-guard.scss';

/* eslint-disable-next-line */
export interface RouteGuardProps {
  children: ReactElement;
  userStore?: UserStore;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  userStore,
}: RouteGuardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    userStore?.isLoggedIn().then((data) => {
      console.log(data);
      setIsAuthenticated(data);
    });
  }, [isAuthenticated]);

  return isAuthenticated ? children : <Redirect to="/login" />;
};

export default RouteGuard;
