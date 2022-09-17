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
import { Route, Redirect, Switch } from 'react-router-dom';
import { tabRoutes } from './tabs';
import { scan } from 'ionicons/icons';
import {
  Login,
  Intro,
  Register,
  Loading,
  ParkDetail,
  ExerciseDetail,
  ResetPassword,
} from '@bregenz-bewegt/client-ui-pages';
import { inject, observer } from 'mobx-react';
import {
  tabStore,
  TabStore,
  UserStore,
  userStore,
} from '@bregenz-bewegt/client/common/stores';
import { useEffect } from 'react';

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
        {userStore?.isLoadingLoginState ? (
          <Loading />
        ) : userStore?.isLoggedIn ? (
          <Tabs />
        ) : (
          <PublicRouterOutlet />
        )}
      </IonReactRouter>
    );
  })
);

export interface TabsProps {
  tabStore?: TabStore;
}

export const Tabs: React.FC<TabsProps> = inject(tabStore.storeKey)(
  observer(({ tabStore }) => {
    return (
      <>
        <IonTabs>
          <IonRouterOutlet>
            <Switch>
              <Route
                exact
                path={'/reset-password/:token'}
                component={ResetPassword}
              ></Route>
              <Route
                exact
                path={`${tabRoutes.start.route}/:park/:exercise`}
                component={ExerciseDetail}
              />
              <Route
                exact
                path={`${tabRoutes.start.route}/:park`}
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
            </Switch>
          </IonRouterOutlet>
          <IonTabBar slot="bottom" hidden={!tabStore?.isShown}>
            {Object.values(tabRoutes).map((page, i) => {
              if (page.label !== 'Scan') {
                return (
                  <IonTabButton
                    mode="ios"
                    tab={page.route}
                    href={page.route}
                    key={i}
                  >
                    <IonIcon icon={page.icon} />
                    <IonLabel>{page.label}</IonLabel>
                  </IonTabButton>
                );
              } else {
                return <IonTabButton disabled tab={page.route}></IonTabButton>;
              }
            })}
          </IonTabBar>
        </IonTabs>
        <IonFab
          vertical="bottom"
          horizontal="center"
          slot="fixed"
          hidden={!tabStore?.isShown}
        >
          <IonFabButton
            routerLink={tabRoutes.scan.route}
            routerDirection="root"
          >
            <IonIcon icon={scan} />
          </IonFabButton>
        </IonFab>
      </>
    );
  })
);

export const PublicRouterOutlet: React.FC = () => {
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
