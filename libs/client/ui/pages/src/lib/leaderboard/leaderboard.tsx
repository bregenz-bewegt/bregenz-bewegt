import { CoinDepot, Header } from '@bregenz-bewegt/client-ui-components';
import { LeaderboardTimespan } from '@bregenz-bewegt/client/types';
import {
  IonCol,
  IonContent,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
} from '@ionic/react';
import { useState } from 'react';
import './leaderboard.scss';

export const Leaderboard: React.FC = () => {
  const [timespan, setTimespan] = useState<LeaderboardTimespan>(
    LeaderboardTimespan.AllTime
  );

  return (
    <IonPage className="leaderboard">
      <Header />
      <IonContent className="leaderboard" fullscreen>
        <CoinDepot />
        <IonRow>
          <IonCol>
            <IonText>
              <h2>Rangliste</h2>
            </IonText>
          </IonCol>
          <IonCol>
            <IonSelect
              interface="popover"
              value={timespan}
              className="leaderboard__timespan-select"
              onIonChange={(e) => setTimespan(e.detail.value)}
            >
              <IonSelectOption value={LeaderboardTimespan.AllTime}>
                Allzeit
              </IonSelectOption>
              <IonSelectOption value={LeaderboardTimespan.Yearly}>
                Jahr
              </IonSelectOption>
            </IonSelect>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};
