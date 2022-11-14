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
    const [activityList, setActivityList] = useState<Activity[]>([]);
    const [activityTimespans, setActivityTimespans] = useState<number[]>();
    const [chartData, setChartData] = useState<Activity[]>();
    const [chartYear, setChartYear] = useState<number>();
    const RELOAD_CHUNK_SIZE = 10;

    const loadInfinite = (e: any) => {
      activityStore
        ?.getActivities({ skip: activityList.length, take: RELOAD_CHUNK_SIZE })
        .then((data) => {
          setActivityList((prev) => [...prev, ...data]);
          e.target.complete();
        })
        .catch(() => {
          setActivityList([]);
          e.target.complete();
        });
    };

    useEffect(() => {
      activityStore
        ?.getActivities({ take: RELOAD_CHUNK_SIZE })
        .then((data) => setActivityList(data));
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
        <IonContent className="analytics__content" fullscreen>
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
          <div className="analytics__content__list">
            {activityList.map((a) => {
              const diff = a.endedAt.getTime() - a.startedAt.getTime();
              const hours = Math.floor(diff / 1000 / 60 / 60);
              const minutes = Math.floor((diff - hours) / 1000 / 60);
              const seconds = Math.floor((diff - hours - minutes) / 1000);
              return (
                <IonCard>
                  {a.exercise.name} | {a.exercise.coins} B-Bucks | {a.park.name}
                  | {difficultyDisplayTexts[a.exercise.difficulty]} | {minutes}
                  min
                  {seconds}sec
                </IonCard>
              );
            })}
          </div>
          <IonInfiniteScroll
            onIonInfinite={loadInfinite}
            threshold="100px"
            className="leaderboard__infinite-scroll-loading"
          >
            <IonInfiniteScrollContent
              loadingSpinner="crescent"
              loadingText="Mehr Aktivitäten laden.."
            ></IonInfiniteScrollContent>
          </IonInfiniteScroll>
        </IonContent>
      </IonPage>
    );
  })
);
