import { Header } from '@bregenz-bewegt/client-ui-components';
import {
  activityStore,
  ActivityStore,
} from '@bregenz-bewegt/client/common/stores';
import { Activity } from '@bregenz-bewegt/client/types';
import { difficultyDisplayTexts } from '@bregenz-bewegt/client/ui/shared/content';
import {
  IonCard,
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonPage,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import './analytics.scss';

export interface AnalyticsProps {
  activityStore?: ActivityStore;
}

export const Analytics: React.FC<AnalyticsProps> = inject(
  activityStore.storeKey
)(
  observer(({ activityStore }) => {
    const [activityList, setActivityList] = useState<
      (Activity & { minutes?: number; seconds?: number })[]
    >([]);
    const [activityTimespans, setActivityTimespans] = useState<number[]>();
    const [chartData, setChartData] = useState<Activity[]>();
    const [chartYear, setChartYear] = useState<number>();
    const [maximumReached, setMaximumReached] = useState<boolean>(false);
    const RELOAD_CHUNK_SIZE = 5;

    const loadInfinite = (e: any) => {
      activityStore
        ?.getActivities({ skip: activityList.length, take: RELOAD_CHUNK_SIZE })
        .then((data) => {
          data.length > 0
            ? setActivityList((prev) => [...prev, ...calculateTime(data)])
            : setMaximumReached(true);
          e.target.complete();
        })
        .catch(() => {
          setActivityList([]);
          e.target.complete();
        });
    };

    const calculateTime = (activities: Activity[]) => {
      return activities.map((a) => {
        const diff =
          new Date(a.endedAt).getTime() - new Date(a.startedAt).getTime();
        const minutes = Math.floor(diff / 1000 / 60);
        const seconds = Math.floor((diff - minutes * 1000 * 60) / 1000);
        return { ...a, minutes, seconds };
      });
    };

    useEffect(() => {
      activityStore
        ?.getActivities({ take: RELOAD_CHUNK_SIZE })
        .then((data) => setActivityList(calculateTime(data)));
      activityStore?.getTimespans().then((data) => setActivityTimespans(data));
    }, []);

    useEffect(() => {
      activityStore
        ?.getActivities({ year: chartYear })
        .then((data) => setChartData(data))
        .catch(() => setChartData([]));
    }, [chartYear]);

    return (
      <IonPage className="analytics">
        <Header />
        <IonContent className="analytics__content" scrollY={false}>
          <h2>Statistik</h2>
          <div className="analytics__content__chart">
            <ul>
              {chartData?.map((a) => (
                <li>{a.exercise.name}</li>
              ))}
            </ul>
            {activityTimespans && (
              <IonSelect
                interface="popover"
                value={chartYear}
                className="leaderboard__timespan__select"
                onIonChange={(e) => setChartYear(e.detail.value)}
                placeholder="Jahr"
              >
                {activityTimespans?.map((span) => (
                  <IonSelectOption value={span}>{span}</IonSelectOption>
                ))}
              </IonSelect>
            )}
          </div>
          <h2>Aktivitäts Verlauf</h2>
          <div className="analytics__content__list ion-content-scroll-host">
            {activityList.length > 0 &&
              activityList.map((a, i) => {
                return (
                  <IonCard key={i}>
                    {a.exercise.name} | {a.exercise.coins} B-Bucks |
                    {a.park.name} |
                    {difficultyDisplayTexts[a.exercise.difficulty]} |{a.minutes}
                    min {a.seconds}sec |{' '}
                    {new Date(a.endedAt).toLocaleTimeString()}
                  </IonCard>
                );
              })}
            <IonInfiniteScroll
              onIonInfinite={loadInfinite}
              threshold="10px"
              className="leaderboard__infinite-scroll-loading"
              disabled={maximumReached}
            >
              <IonInfiniteScrollContent
                loadingSpinner="crescent"
                loadingText="Mehr Aktivitäten laden.."
              ></IonInfiniteScrollContent>
            </IonInfiniteScroll>
          </div>
        </IonContent>
      </IonPage>
    );
  })
);
