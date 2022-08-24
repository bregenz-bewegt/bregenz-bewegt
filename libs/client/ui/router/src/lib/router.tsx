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
import { tabRoutes } from './routes';
import { scan } from 'ionicons/icons';
import { Login, Intro, Register } from '@bregenz-bewegt/client-ui-pages';
import { inject, observer } from 'mobx-react';
import { UserStore, userStore } from '@bregenz-bewegt/client/common/stores';
import { RouteGuard } from '@bregenz-bewegt/client-ui-components';
import { useEffect, useState } from 'react';

export interface RouterProps {
  userStore?: UserStore;
}

export const Router: React.FC<RouterProps> = inject(userStore.storeKey)(
  observer(({ userStore }: RouterProps) => {
    const [displayTabs, setDisplayTabs] = useState<boolean>(false);

    useEffect(() => {
      userStore?.isLoggedIn().then((isLoggedIn) => {
        setDisplayTabs(isLoggedIn);
      });
    }, [userStore]);

    return (
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path={'/intro'} component={() => <Intro />}></Route>
            <Route exact path={'/login'} component={() => <Login />}></Route>
            <Route
              exact
              path={'/register'}
              component={() => <Register />}
            ></Route>
            {Object.values(tabRoutes).map((page, i) => {
              return (
                <Route
                  exact
                  path={`${page.route}`}
                  key={i}
                  component={() => (
                    <RouteGuard>
                      <page.component />
                    </RouteGuard>
                  )}
                ></Route>
              );
            })}
            <Route path="">
              <Redirect to="/start" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar
            slot="bottom"
            style={!displayTabs ? { display: 'none' } : {}}
          >
            {Object.values(tabRoutes).map((page, i) => {
              if (page.label !== 'Scan') {
                return (
                  <IonTabButton tab={page.route} href={page.route} key={i}>
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
          style={!displayTabs ? { display: 'none' } : {}}
        >
          <IonFabButton href={tabRoutes.scan.route}>
            <IonIcon icon={scan} />
          </IonFabButton>
        </IonFab>
      </IonReactRouter>
    );
  })
);
