import { Header } from '@bregenz-bewegt/client-ui-components';
import { IonContent, IonPage } from '@ionic/react';
import './analytics.scss';

export const Analytics: React.FC = () => {
  return (
    <IonPage>
      <Header />
      <IonContent className="analytics" fullscreen></IonContent>
    </IonPage>
  );
};
