import {
  ResetPassword,
  ExerciseDetail,
  ParkDetail,
  Appearance,
  PublicProfile,
  Difficulty,
  Email,
  Password,
  Friends,
  CompetitorProfile,
  Notifications,
  PrivacyPolice,
  Conversation,
  Sponsors,
} from '@bregenz-bewegt/client-ui-pages';
import { TabStore, tabStore } from '@bregenz-bewegt/client/common/stores';
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonFab,
  IonFabButton,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { Route, Redirect, RouteComponentProps } from 'react-router-dom';
import { tabRoutes } from '../tabs';
import { ScanBarcode } from 'iconsax-react';
import {
  NotificationListener,
  RoleRouteGuard,
} from '@bregenz-bewegt/client-ui-components';
import { Role } from '@bregenz-bewegt/client/types';

export interface PrivateTabsOutletProps {
  tabStore?: TabStore;
}

export const PrivateTabsOutlet: React.FC<PrivateTabsOutletProps> = inject(
  tabStore.storeKey
)(
  observer(({ tabStore }) => {
    return (
      <>
        <IonTabs>
          <IonRouterOutlet>
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
            <Route
              exact
              path={`/notifications`}
              component={Notifications}
            ></Route>
            <Route
              exact
              path={`/users/:username`}
              component={(props: RouteComponentProps<any>) => (
                <RoleRouteGuard allowedRoles={[Role.USER]}>
                  <CompetitorProfile {...props} />
                </RoleRouteGuard>
              )}
            ></Route>
            <Route
              exact
              path={`${tabRoutes.profile.route}/appearance`}
              component={() => (
                <RoleRouteGuard allowedRoles={[Role.USER]}>
                  <Appearance />
                </RoleRouteGuard>
              )}
            ></Route>
            <Route
              exact
              path={`${tabRoutes.profile.route}/public-profile`}
              component={() => (
                <RoleRouteGuard allowedRoles={[Role.USER]}>
                  <PublicProfile />
                </RoleRouteGuard>
              )}
            ></Route>
            <Route
              exact
              path={`${tabRoutes.profile.route}/difficulty`}
              component={() => (
                <RoleRouteGuard allowedRoles={[Role.USER]}>
                  <Difficulty />
                </RoleRouteGuard>
              )}
            ></Route>
            <Route
              exact
              path={`${tabRoutes.profile.route}/friends`}
              component={() => (
                <RoleRouteGuard allowedRoles={[Role.USER]}>
                  <Friends />
                </RoleRouteGuard>
              )}
            ></Route>
            <Route
              exact
              path={`${tabRoutes.profile.route}/chat/:username`}
              component={(props: RouteComponentProps<any>) => (
                <RoleRouteGuard allowedRoles={[Role.USER]}>
                  <Conversation {...props} />
                </RoleRouteGuard>
              )}
            ></Route>
            <Route
              exact
              path={`${tabRoutes.profile.route}/email`}
              component={() => (
                <RoleRouteGuard allowedRoles={[Role.USER]}>
                  <Email />
                </RoleRouteGuard>
              )}
            ></Route>
            <Route
              exact
              path={`${tabRoutes.profile.route}/password`}
              component={() => (
                <RoleRouteGuard allowedRoles={[Role.USER]}>
                  <Password />
                </RoleRouteGuard>
              )}
            ></Route>
            <Route
              exact
              path={`${tabRoutes.profile.route}/privacy-police`}
              component={() => (
                <PrivacyPolice
                  defaultBackRouterLinkt={`${tabRoutes.profile.route}`}
                />
              )}
            ></Route>
            <Route
              exact
              path={`${tabRoutes.profile.route}/sponsors`}
              component={Sponsors}
            ></Route>
            <Route path="">
              <Redirect to="/start" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar
            slot="bottom"
            mode="md"
            hidden={!tabStore?.isShown}
            className="ion-no-border"
          >
            {Object.values(tabRoutes).map((page, i) => {
              if (page.label !== 'Scan') {
                return (
                  <IonTabButton
                    mode="ios"
                    tab={page.route}
                    href={page.route}
                    key={i}
                  >
                    <page.icon />
                  </IonTabButton>
                );
              } else {
                return (
                  <IonTabButton
                    disabled
                    tab={page.route}
                    key={i}
                  ></IonTabButton>
                );
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
            <ScanBarcode size={24} variant="Bold" />
          </IonFabButton>
        </IonFab>
        <NotificationListener />
      </>
    );
  })
);
