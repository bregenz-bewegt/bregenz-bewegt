import {
  ResetPassword,
  ExerciseDetail,
  ParkDetail,
} from '@bregenz-bewegt/client-ui-pages';
import { TabStore, tabStore } from '@bregenz-bewegt/client/common/stores';
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
import { inject, observer } from 'mobx-react';
import { Route, Redirect } from 'react-router-dom';
import { tabRoutes } from '../tabs';
import { scan } from 'ionicons/icons';

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
            {/* <Switch> */}
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
            {/* </Switch> */}
          </IonRouterOutlet>
          <IonTabBar slot="bottom" mode="md" hidden={!tabStore?.isShown}>
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
