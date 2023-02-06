import {
  ActivityCard,
  Chart,
  Header,
} from '@bregenz-bewegt/client-ui-components';
import {
  activityStore,
  ActivityStore,
} from '@bregenz-bewegt/client/common/stores';
import { Activity, ActivityChartData } from '@bregenz-bewegt/client/types';
import {
  IonContent,
  IonFabButton,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonText,
  ScrollDetail,
  useIonViewWillEnter,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { createRef, useEffect, useState } from 'react';
import './analytics.scss';

import { ArrowUp2 } from 'iconsax-react';

export interface AnalyticsProps {
  activityStore?: ActivityStore;
}

const RELOAD_CHUNK_SIZE = 5;

export const Analytics: React.FC<AnalyticsProps> = inject(
  activityStore.storeKey
)(
  observer(({ activityStore }) => {
    const [activityList, setActivityList] = useState<
      (Activity & { minutes?: string; seconds?: string })[]
    >([]);
    const [chartMonthTimespans, setChartMonthTimespans] = useState<number[]>();
    const [chartData, setChartData] = useState<ActivityChartData>();
    const [chartFilterMonth, setChartFilterMonth] = useState<number>();
    const [showTopButton, setShowTopButton] = useState<boolean>(false);
    const contentRef = createRef<HTMLIonContentElement>();

    const loadInfinite = (
      e?: any,
      skip?: number,
      take?: number,
      replace?: boolean
    ) => {
      activityStore
        ?.getActivities({
          skip: skip ?? activityList.length,
          take: take ?? RELOAD_CHUNK_SIZE,
        })
        .then((data) => {
          setActivityList((prev) => [
            ...(replace ? [] : prev),
            ...calculateTime(data),
          ]);
          e && e.target.complete();
        })
        .catch(() => {
          setActivityList([]);
          e && e.target.complete();
        });
    };

    const calculateTime = (
      activities: Activity[]
    ): (Activity & { minutes?: string; seconds?: string })[] => {
      return activities.map((a) => {
        const diff =
          new Date(a.endedAt).getTime() - new Date(a.startedAt).getTime();
        const minutes = Math.floor(diff / 1000 / 60);
        const seconds = Math.floor((diff - minutes * 1000 * 60) / 1000);
        return {
          ...a,
          minutes: String(minutes).padStart(2, '0'),
          seconds: String(seconds).padStart(2, '0'),
        };
      });
    };

    const updateChartData = (month: number) => {
      activityStore
        ?.getChartData(month)
        .then((data) => {
          setChartData(data);
        })
        .catch(() => setChartData(undefined));
    };

    useEffect(() => {
      loadInfinite();
    }, []);

    useEffect(() => {
      chartFilterMonth && updateChartData(chartFilterMonth);
    }, [chartFilterMonth]);

    useIonViewWillEnter(() => {
      activityStore?.getTimespans().then((data) => {
        setChartMonthTimespans(data);
        setChartFilterMonth(data[0]);
        updateChartData(data[0]);
      });

      activityList.length > 0 &&
        loadInfinite(null, 0, activityList.length, true);
    }, [activityList.length]);

    return (
      <IonPage className="analytics">
        <Header />
        <IonContent
          className="analytics__content"
          scrollY={true}
          ref={contentRef}
          scrollEvents={true}
          onIonScroll={(e: CustomEvent<ScrollDetail>) =>
            setShowTopButton(e.detail.currentY > 700 ? true : false)
          }
        >
          <div className="analytics__content__chart">
            <div className="analytics__content__chart__headline">
              <h2>Münzen im</h2>
              <h2>
                {chartMonthTimespans && (
                  <IonSelect
                    interface="popover"
                    value={chartFilterMonth}
                    onIonChange={(e) => setChartFilterMonth(e.detail.value)}
                    placeholder="Jahr"
                  >
                    {chartMonthTimespans?.map((span) => {
                      const month = new Date();
                      month.setMonth(span - 1);

                      return (
                        <IonSelectOption value={span} key={span}>
                          {month.toLocaleString('default', {
                            month: 'long',
                          })}
                        </IonSelectOption>
                      );
                    })}
                  </IonSelect>
                )}
              </h2>
            </div>
            {chartFilterMonth !== null &&
            chartFilterMonth !== undefined &&
            chartData &&
            chartData.length > 0 ? (
              <Chart
                chartData={chartData}
                chartFilterMonth={chartFilterMonth}
              />
            ) : (
              <IonText>Zu wenig Daten für die Statistik vorhanden</IonText>
            )}
          </div>

          <div className="analytics__content__list">
            {activityList.length > 0 &&
              activityList.map((a, i, arr) => {
                const newD = new Date(a.endedAt);
                return (
                  <>
                    {(i === 0 ||
                      new Date(arr[i - 1].endedAt).getDate() !==
                        newD.getDate()) && (
                      <div
                        className="analytics__content__list__title"
                        key={JSON.stringify(a)}
                      >
                        {i === 0 && <h2>Verlauf</h2>}
                        <h4>
                          {newD.toLocaleString('default', {
                            day: 'numeric',
                            month: 'long',
                          })}
                        </h4>
                      </div>
                    )}
                    <ActivityCard
                      activity={a}
                      key={i}
                      className="analytics__content__list__card"
                    />
                  </>
                );
              })}
            <IonInfiniteScroll
              onIonInfinite={loadInfinite}
              className="leaderboard__infinite-scroll-loading"
            >
              <IonInfiniteScrollContent
                loadingSpinner="crescent"
                loadingText="Mehr Aktivitäten laden..."
              ></IonInfiniteScrollContent>
            </IonInfiniteScroll>
          </div>
          <IonFabButton
            slot="fixed"
            className="analytics__content__top-button"
            onClick={() => contentRef.current?.scrollToTop(500)}
            style={{ opacity: showTopButton ? 1 : 0 }}
          >
            <ArrowUp2 size={32} color="white" variant="Linear" />
          </IonFabButton>
        </IonContent>
      </IonPage>
    );
  })
);
