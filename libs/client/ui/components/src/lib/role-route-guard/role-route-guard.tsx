import { Loading } from '@bregenz-bewegt/client-ui-pages';
import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import { Role } from '@bregenz-bewegt/client/types';
import { inject, observer } from 'mobx-react';
import { ReactElement } from 'react';
import { Redirect } from 'react-router-dom';

export interface RoleRouteGuardProps {
  children: ReactElement;
  allowedRoles: Role[];
  userStore?: UserStore;
}

export const RoleRouteGuard: React.FC<RoleRouteGuardProps> = inject(
  userStore.storeKey
)(
  observer(({ children, allowedRoles, userStore }: RoleRouteGuardProps) => {
    return userStore?.isLoadingLoggedIn ? (
      <Loading />
    ) : userStore?.isLoggedIn &&
      userStore.user?.role &&
      allowedRoles.includes(userStore.user.role) ? (
      children
    ) : (
      <Redirect to="/login" />
    );
  })
);
