import { CoinDepot, Header } from '@bregenz-bewegt/client-ui-components';
import {
  leaderboardStore,
  LeaderboardStore,
} from '@bregenz-bewegt/client/common/stores';
import { LeaderboardTimespan } from '@bregenz-bewegt/client/types';
import { Competitor } from '@bregenz-bewegt/shared/types';
import {
  IonCol,
  IonContent,
  IonGrid,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import './leaderboard.scss';

export interface LeaderboardProps {
  leaderboardStore?: LeaderboardStore;
}

export const Leaderboard: React.FC<LeaderboardProps> = inject(
  leaderboardStore.storeKey
)(
  observer(({ leaderboardStore }) => {
    const [timespan, setTimespan] = useState<LeaderboardTimespan>(
      LeaderboardTimespan.AllTime
    );
    const [leaderboard, setLeaderboard] = useState<Competitor[]>();

    useEffect(() => {
      leaderboardStore
        ?.fetch()
        .then((data) => setLeaderboard([...data, ...data, ...data]))
        .catch(() => {
          setLeaderboard([]);
        });
    }, []);

    return (
      <IonPage className="leaderboard">
        <Header />
        <IonContent fullscreen scrollY={false}>
          <CoinDepot />
          <IonRow>
            <IonCol className="ion-align-center">
              <IonText>
                <h2>Rangliste</h2>
              </IonText>
            </IonCol>
            <IonCol className="ion-align-center leaderboard__timespan">
              <IonSelect
                interface="popover"
                value={timespan}
                className="leaderboard__timespan__select"
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
          <IonGrid className="leaderboard__table">
            <IonRow className="leaderboard__table__head">
              <IonCol
                size="8"
                className="leaderboard__table__head__user align-center"
              >
                Benutzer
              </IonCol>
              <IonCol
                className="leaderboard__table__head__coins align-center"
                size="4"
              >
                Coins
              </IonCol>
            </IonRow>
            {leaderboard &&
              leaderboard?.length > 0 &&
              leaderboard?.map((competitor) => (
                <IonRow>
                  <IonCol size="8" className="align-center">
                    {competitor.username}
                  </IonCol>
                  <IonCol size="4" className="align-center">
                    {competitor.coins}
                  </IonCol>
                </IonRow>
              ))}
          </IonGrid>
          <IonInfiniteScroll
            onIonInfinite={() => setTimeout(() => void 0, 1000)}
            threshold="100px"
          >
            <IonInfiniteScrollContent
              loadingSpinner="crescent"
              loadingText="Mehr Benutzer laden.."
            ></IonInfiniteScrollContent>
          </IonInfiniteScroll>
        </IonContent>
      </IonPage>
    );
  })
);
