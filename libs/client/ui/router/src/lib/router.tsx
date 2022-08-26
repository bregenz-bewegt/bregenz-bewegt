import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonFab,
  IonFabButton,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import { tabRoutes } from './tabs';
import { scan } from 'ionicons/icons';
import {
  Login,
  Intro,
  Register,
  Loading,
  ParkDetail,
} from '@bregenz-bewegt/client-ui-pages';
import { inject, observer } from 'mobx-react';
import { UserStore, userStore } from '@bregenz-bewegt/client/common/stores';
import { TabBar } from '@bregenz-bewegt/client-ui-components';

export interface RouterProps {
  userStore?: UserStore;
}

export const Router: React.FC<RouterProps> = inject(userStore.storeKey)(
  observer(({ userStore }: RouterProps) => {
    return (
      <IonReactRouter>
        {userStore?.isLoadingLoginState ? (
          <Loading />
        ) : userStore?.isLoggedIn ? (
          <Tabs />
        ) : (
          <RequireAuth />
        )}
      </IonReactRouter>
    );
  })
);

export const Tabs: React.FC = () => {
  return (
    <>
      <IonTabs>
        <IonRouterOutlet>
          <Route
            exact
            path={`${tabRoutes.start.route}/:id`}
            component={ParkDetail}
          />
          <Route
            exact
            path={tabRoutes.start.route}
            component={tabRoutes.start.component}
          ></Route>
          <Route
            exact
            path={tabRoutes.leaderboard.route}
            component={tabRoutes.leaderboard.component}
          ></Route>
          <Route
            exact
            path={tabRoutes.scan.route}
            component={tabRoutes.scan.component}
          ></Route>
          <Route
            exact
            path={tabRoutes.analytics.route}
            component={tabRoutes.analytics.component}
          ></Route>
          <Route
            exact
            path={tabRoutes.profile.route}
            component={tabRoutes.profile.component}
          ></Route>
          <Route path="">
            <Redirect to="/start" />
          </Route>
        </IonRouterOutlet>
        <TabBar tabRoutes={tabRoutes} />
      </IonTabs>
      <IonFab vertical="bottom" horizontal="center" slot="fixed">
        <IonFabButton routerLink={tabRoutes.scan.route} routerDirection="root">
          <IonIcon icon={scan} />
        </IonFabButton>
      </IonFab>
    </>
  );
};

export const RequireAuth: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Route exact path={'/intro'} component={Intro}></Route>
      <Route exact path={'/login'} component={Login}></Route>
      <Route exact path={'/register'} component={Register}></Route>
      <Route path="">
        <Redirect to="/login" />
      </Route>
    </IonRouterOutlet>
  );
};
