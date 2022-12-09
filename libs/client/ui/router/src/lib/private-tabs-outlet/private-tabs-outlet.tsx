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
} from '@bregenz-bewegt/client-ui-pages';
import {
  friendsStore,
  FriendsStore,
  notificationsStore,
  NotificationsStore,
  TabStore,
  tabStore,
} from '@bregenz-bewegt/client/common/stores';
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonFab,
  IonFabButton,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { Route, Redirect } from 'react-router-dom';
import { tabRoutes } from '../tabs';
import { ScanBarcode } from 'iconsax-react';
import { useEffect } from 'react';
import { useDefaultErrorToast } from '@bregenz-bewegt/client/common/hooks';
import { Notification } from '@bregenz-bewegt/client/types';

export interface PrivateTabsOutletProps {
  tabStore?: TabStore;
  friendsStore?: FriendsStore;
  notificationsStore?: NotificationsStore;
}

export const PrivateTabsOutlet: React.FC<PrivateTabsOutletProps> = inject(
  tabStore.storeKey,
  friendsStore.storeKey,
  notificationsStore.storeKey
)(
  observer(({ tabStore, friendsStore, notificationsStore }) => {
    const [presentDefaultErrorToast] = useDefaultErrorToast();

    const fetchFriendRequests = () => {
      friendsStore
        ?.getAllFriendRequests()
        .then((data) => {
          console.log(data);
          data.received &&
            data.received.length > 0 &&
            notificationsStore?.addNotifications(
              data.received.map(
                (r) =>
                  ({
                    title: 'Freundschaftsanfrage',
                    description: `${r.requestee.username} hat dir eine Freundschaftsanfrage gesendet`,
                    routerLink: `${tabRoutes.profile.route}/friends`,
                  } as Notification)
              )
            );
        })
        .catch(() => {
          presentDefaultErrorToast();
        });
    };

    useEffect(() => {
      fetchFriendRequests();
    });

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
            <Route
              exact
              path={`/notifications`}
              component={Notifications}
            ></Route>
            <Route
              exact
              path={`/users/:id`}
              component={CompetitorProfile}
            ></Route>
            <Route
              exact
              path={`${tabRoutes.profile.route}/appearance`}
              component={Appearance}
            ></Route>
            <Route
              exact
              path={`${tabRoutes.profile.route}/public-profile`}
              component={PublicProfile}
            ></Route>
            <Route
              exact
              path={`${tabRoutes.profile.route}/difficulty`}
              component={Difficulty}
            ></Route>
            <Route
              exact
              path={`${tabRoutes.profile.route}/friends`}
              component={Friends}
            ></Route>
            <Route
              exact
              path={`${tabRoutes.profile.route}/email`}
              component={Email}
            ></Route>
            <Route
              exact
              path={`${tabRoutes.profile.route}/password`}
              component={Password}
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
      </>
    );
  })
);
