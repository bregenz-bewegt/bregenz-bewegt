import {
  ActivityCard,
  DifficultyBadge,
  Header,
} from '@bregenz-bewegt/client-ui-components';
import {
  activityStore,
  ActivityStore,
} from '@bregenz-bewegt/client/common/stores';
import { Activity, ActivityChartData } from '@bregenz-bewegt/client/types';
import {
  IonCard,
  IonContent,
  IonFabButton,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  ScrollDetail,
  useIonViewWillEnter,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { createRef, useEffect, useState } from 'react';
import './analytics.scss';
import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { ArrowCircleUp } from 'iconsax-react';

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
    const [chartMonthTimespans, setChartMonthTimespans] = useState<number[]>();
    const [chartData, setChartData] = useState<ActivityChartData>();
    const [chartFilterMonth, setChartFilterMonth] = useState<number>();
    const [maximumReached, setMaximumReached] = useState<boolean>(false);
    const [showTopButton, setShowTopButton] = useState<boolean>(false);
    const contentRef = createRef<HTMLIonContentElement>();
    const RELOAD_CHUNK_SIZE = 5;

    type calculateTicksProps = {
      min: number;
      max: number;
      count: number;
      round: number;
      includeMin: boolean;
    };

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

    const calculateTime = (
      activities: Activity[]
    ): (Activity & { minutes?: number; seconds?: number })[] => {
      return activities.map((a) => {
        const diff =
          new Date(a.endedAt).getTime() - new Date(a.startedAt).getTime();
        const minutes = Math.floor(diff / 1000 / 60);
        const seconds = Math.floor((diff - minutes * 1000 * 60) / 1000);
        return { ...a, minutes, seconds };
      });
    };

    const calculateTicks = ({
      min,
      max,
      count,
      round,
      includeMin,
    }: calculateTicksProps): number[] => {
      const interval =
        Math.round(((max - min + 1) / count + Number.EPSILON) / round) * round;
      return [...Array(count)].map((_x, i) => {
        const y = includeMin ? i : i + 1;
        if (y === 0) return min;
        return i === count - 1 ? max : min + y * interval - 1;
      });
    };

    const updateChartData = (month: number) => {
      activityStore
        ?.getChartData(month)
        .then((data) => setChartData(data))
        .catch(() => setChartData(undefined));
    };

    useEffect(() => {
      chartFilterMonth && updateChartData(chartFilterMonth);
    }, [chartFilterMonth]);

    useIonViewWillEnter(() => {
      activityStore
        ?.getActivities({ take: RELOAD_CHUNK_SIZE })
        .then((data) => setActivityList(calculateTime(data)));
      activityStore?.getTimespans().then((data) => {
        setChartMonthTimespans(data);
        setChartFilterMonth(data[0]);
        updateChartData(data[0]);
      });
    }, []);

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
                    {chartMonthTimespans?.map((span, i) => {
                      const month = new Date();
                      month.setMonth(span);
                      return (
                        <IonSelectOption value={span} key={i}>
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
            {chartFilterMonth && chartData && (
              <ResponsiveContainer width={'100%'} height={200}>
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 20, left: -25, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="color-coins"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--ion-color-secondary)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--ion-color-secondary)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    unit={'.'}
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    interval="preserveStartEnd"
                    ticks={calculateTicks({
                      min: 1,
                      max: new Date(
                        new Date().getFullYear(),
                        chartFilterMonth + 1,
                        0
                      ).getDate(),
                      count: 7,
                      round: 5,
                      includeMin: true,
                    })}
                  />
                  <YAxis
                    dataKey="coins"
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    interval="preserveStartEnd"
                    ticks={calculateTicks({
                      min: 1,
                      max: chartData?.reduce(
                        (r, d) => (d.coins > r ? d.coins : r),
                        0
                      ),
                      count: 4,
                      round: 10,
                      includeMin: false,
                    })}
                  />
                  <Area
                    type="monotoneX"
                    dataKey="coins"
                    fill="url(#color-coins)"
                    stroke="var(--ion-color-primary)"
                    fillOpacity={1}
                  />
                  <ReferenceLine
                    label={{ value: '∅', position: 'right' }}
                    y={Math.floor(
                      chartData?.reduce((r, d) => r + d.coins, 0) /
                        chartData?.length
                    )}
                    stroke="black"
                    opacity={0.5}
                    fillOpacity={1}
                  />
                </AreaChart>
              </ResponsiveContainer>
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
                      <div className="analytics__content__list__title">
                        {i === 0 && <h2>Verlauf</h2>}
                        <h4>
                          {newD.toLocaleString('default', {
                            day: 'numeric',
                            month: 'long',
                          })}
                        </h4>
                      </div>
                    )}
                    <ActivityCard activity={a} key={i} />
                  </>
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
            <ArrowCircleUp size={32} color="white" variant="Bold" />
          </IonFabButton>
        </IonContent>
      </IonPage>
    );
  })
);
