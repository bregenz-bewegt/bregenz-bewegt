import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import { IonSpinner } from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { ReactElement, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import './route-guard.scss';

/* eslint-disable-next-line */
export interface RouteGuardProps {
  children: ReactElement;
  userStore?: UserStore;
}

export const RouteGuard: React.FC<RouteGuardProps> = inject(userStore.storeKey)(
  observer(({ children, userStore }: RouteGuardProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
      userStore?.isLoggedIn().then((data) => {
        console.log(data);
        setIsAuthenticated(data);
        setIsLoading(false);
      });
    }, []);

    return isLoading ? (
      <IonSpinner name="crescent"></IonSpinner>
    ) : isAuthenticated ? (
      children
    ) : (
      <Redirect to="/login" />
    );
  })
);

export default RouteGuard;
