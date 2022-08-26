import './tab-bar.scss';
import { IonIcon, IonLabel, IonTabBar, IonTabButton } from '@ionic/react';
import { TabRoutes } from '@bregenz-bewegt/client-ui-router';

export interface TabBarProps {
  tabRoutes: TabRoutes;
}

export const TabBar: React.FC<TabBarProps> = ({ tabRoutes }) => {
  return (
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
  );
};

export default TabBar;
