import { Header } from '@bregenz-bewegt/client-ui-components';
import { IonContent, IonPage, IonText } from '@ionic/react';
import './analytics.scss';

export const Analytics: React.FC = () => {
  return (
    <IonPage className="analytics">
      <Header />
      <IonContent className="analytics__content" fullscreen>
        <IonText className="analytics__content__title">
          <h2>Statistik</h2>
        </IonText>
        <IonText>
          <h2>Aktivitäts Verlauf</h2>
        </IonText>
      </IonContent>
    </IonPage>
  );
};
