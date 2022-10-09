import { CoinDepot, Header } from '@bregenz-bewegt/client-ui-components';
import { IonContent, IonPage, IonRow, IonText } from '@ionic/react';
import './leaderboard.scss';

export const Leaderboard: React.FC = () => {
  return (
    <IonPage className="leaderboard">
      <Header />
      <IonContent className="leaderboard" fullscreen>
        <CoinDepot />
        <IonRow>
          <IonText>
            <h2>Rangliste</h2>
          </IonText>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};
