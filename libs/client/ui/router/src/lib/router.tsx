import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonFab,
  IonFabButton,
  IonTab,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import { routes } from './routes';
import { scan } from 'ionicons/icons';

export const Router: React.FC = () => {
  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          {Object.values(routes).map((page, i) => {
            return (
              <Route exact path={`${page.route}`} key={i}>
                <page.component />
              </Route>
            );
          })}
          <Route exact path="/">
            <Redirect to="/start" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          {Object.values(routes).map((page, i) => {
            if (page.label !== 'Scan') {
              return (
                <IonTabButton tab={page.route} href={page.route} key={i}>
                  <IonIcon icon={page.icon} />
                  <IonLabel>{page.label}</IonLabel>
                </IonTabButton>
              );
            } else {
              return <IonTabButton tab={page.route}></IonTabButton>;
            }
          })}
        </IonTabBar>
      </IonTabs>
      <IonFab vertical="bottom" horizontal="center" slot="fixed">
        <IonFabButton href={routes['scan'].route}>
          <IonIcon icon={scan} />
        </IonFabButton>
      </IonFab>
    </IonReactRouter>
  );
};
