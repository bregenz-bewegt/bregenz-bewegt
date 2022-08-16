import {
  Start,
  Leaderboard,
  Scan,
  Analytics,
  Profile,
} from '@bregenz-bewegt/pages';
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import { routes } from './routes';

export const Router: React.FC = () => {
  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          {Object.values(routes).map((page) => {
            return (
              <Route exact path={`${page.route}`}>
                <page.component />
              </Route>
            );
          })}
          <Route exact path="/">
            <Redirect to="/start" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          {Object.values(routes).map((page) => {
            return (
              <IonTabButton tab={page.route} href={page.route}>
                <IonIcon icon={page.icon} />
                <IonLabel>{page.label}</IonLabel>
              </IonTabButton>
            );
          })}
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};
