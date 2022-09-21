import { IonReactRouter } from '@ionic/react-router';
import { Loading } from '@bregenz-bewegt/client-ui-pages';
import { inject, observer } from 'mobx-react';
import { UserStore, userStore } from '@bregenz-bewegt/client/common/stores';
import { useEffect } from 'react';
import { PrivateTabsOutlet } from './private-tabs-outlet/private-tabs-outlet';
import { PublicOutlet } from './public-outlet/public-outlet';

export interface RouterProps {
  userStore?: UserStore;
}

export const Router: React.FC<RouterProps> = inject(userStore.storeKey)(
  observer(({ userStore }: RouterProps) => {
    useEffect(() => {
      userStore?.initUser();
    }, []);

    return (
      <IonReactRouter>
        {userStore?.isLoadingLoggedIn ? (
          <Loading />
        ) : userStore?.isLoggedIn ? (
          <PrivateTabsOutlet />
        ) : (
          <PublicOutlet />
        )}
      </IonReactRouter>
    );
  })
);
