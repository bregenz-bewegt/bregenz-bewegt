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
import { Login } from '@bregenz-bewegt/client-ui-pages';

export const Router: React.FC = () => {
  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path={'/login'} component={() => <Login />}></Route>
          {Object.values(tabRoutes).map((page, i) => {
            return (
              <Route exact path={`${page.route}`} key={i}>
                <page.component />
              </Route>
            );
          })}
          <Route path="">
            <Redirect to="/start" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
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
      <IonFab vertical="bottom" horizontal="center" slot="fixed">
        <IonFabButton href={tabRoutes.scan.route}>
          <IonIcon icon={scan} />
        </IonFabButton>
      </IonFab>
    </IonReactRouter>
  );
};
