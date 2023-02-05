import {
  ActivityCard,
  GuestLock,
  Header,
} from '@bregenz-bewegt/client-ui-components';
import {
  activityStore,
  ActivityStore,
} from '@bregenz-bewegt/client/common/stores';
import {
  Activity,
  ActivityChartData,
  Exercise,
  Role,
} from '@bregenz-bewegt/client/types';
import {
  IonContent,
  IonFabButton,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonPage,
  IonSelect,
  IonSelectOption,
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
import { ArrowUp2 } from 'iconsax-react';
import { useIsGuest } from '@bregenz-bewegt/client/common/hooks';
import { DifficultyType } from '@prisma/client';

export interface AnalyticsProps {
  activityStore?: ActivityStore;
}

type CalculateTicksProps = {
  min: number;
  max: number;
  count: number;
  round: number;
  includeMin: boolean;
};

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
    const [isGuest] = useIsGuest();

    const guestMockChart = [
      {
        date: 1,
        coins: 10,
      },
      {
        date: 3,
        coins: 35,
      },
      {
        date: 6,
        coins: 15,
      },
      {
        date: 9,
        coins: 30,
      },
      {
        date: 12,
        coins: 45,
      },
      {
        date: 15,
        coins: 20,
      },
      {
        date: 18,
        coins: 25,
      },
      {
        date: 21,
        coins: 10,
      },
      {
        date: 24,
        coins: 30,
      },
      {
        date: 27,
        coins: 35,
      },
      {
        date: 31,
        coins: 25,
      },
    ];
    const guestMockList: (Activity & {
      minutes?: string | undefined;
      seconds?: string | undefined;
    })[] = [
      {
        id: '',
        minutes: '00',
        seconds: '01',
        endedAt: new Date(),
        exercise: {
          id: 5,
          name: 'Versteinerte Hexe',
          description: 'some description',
          execution: 'some execution detials',
          muscles: 'some muscles that are used',
          video: 'exercises/situp.mp4',
          coins: 10,
          difficulty: DifficultyType.GAME as Exercise['difficulty'],
        },
        park: {
          id: 7,
          qr: 'not-yet-defined-6',
          name: 'Tschutterplatz beim Stadion',
          address: 'Rotfarbgasse 14a, 6900 Bregenz',
          image: 'parks/tschutterplatz-beim-stadion.png',
          gmaps: undefined,
        },
        startedAt: new Date(),
        user: {
          updatedAt: new Date(),
          role: Role.USER,
          registratedAt: new Date(),
          id: '',
          active: true,
        },
      },
      {
        id: '',
        minutes: '00',
        seconds: '01',
        endedAt: new Date(),
        exercise: {
          id: 5,
          name: 'Plank',
          description: 'some description',
          execution: 'some execution detials',
          muscles: 'some muscles that are used',
          video: 'exercises/situp.mp4',
          coins: 10,
          difficulty: DifficultyType.BEGINNER as Exercise['difficulty'],
        },
        park: {
          id: 7,
          qr: 'not-yet-defined-6',
          name: 'Tschutterplatz beim Stadion',
          address: 'Rotfarbgasse 14a, 6900 Bregenz',
          image: 'parks/tschutterplatz-beim-stadion.png',
          gmaps: undefined,
        },
        startedAt: new Date(),
        user: {
          updatedAt: new Date(),
          role: Role.USER,
          registratedAt: new Date(),
          id: '',
          active: true,
        },
      },
      {
        id: '',
        minutes: '00',
        seconds: '01',
        endedAt: new Date(),
        exercise: {
          id: 5,
          name: 'Kniebeuge auf Bank',
          description: 'some description',
          execution: 'some execution detials',
          muscles: 'some muscles that are used',
          video: 'exercises/situp.mp4',
          coins: 10,
          difficulty: DifficultyType.BEGINNER as Exercise['difficulty'],
        },
        park: {
          id: 7,
          qr: 'not-yet-defined-6',
          name: 'Tschutterplatz beim Stadion',
          address: 'Rotfarbgasse 14a, 6900 Bregenz',
          image: 'parks/tschutterplatz-beim-stadion.png',
          gmaps: undefined,
        },
        startedAt: new Date(),
        user: {
          updatedAt: new Date(),
          role: Role.USER,
          registratedAt: new Date(),
          id: '',
          active: true,
        },
      },
    ];

    const guestMockTimespans = [11, 10];

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
          setActivityList((prev) => {
            return [...(replace ? [] : prev), ...calculateTime(data)];
          });

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

    const calculateTicks = ({
      min,
      max,
      count,
      round,
      includeMin,
    }: CalculateTicksProps): number[] => {
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
      if (isGuest) return;

      loadInfinite();
    }, []);

    useEffect(() => {
      if (isGuest) return;

      chartFilterMonth && updateChartData(chartFilterMonth);
    }, [chartFilterMonth]);

    useIonViewWillEnter(() => {
      if (isGuest) {
        setChartMonthTimespans(guestMockTimespans);
        setChartFilterMonth(guestMockTimespans[0]);
        setChartData(guestMockChart);
        setActivityList(guestMockList);
        return;
      }

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
          scrollY={!isGuest}
          ref={contentRef}
          scrollEvents={true}
          onIonScroll={(e: CustomEvent<ScrollDetail>) =>
            setShowTopButton(e.detail.currentY > 700 ? true : false)
          }
        >
          <GuestLock
            modalClassName="analytics-guest-lock-modal"
            text="Melde dich bei deinem Konto an, um auf dein Profil zugreifen zu können"
          >
            {() => (
              <>
                <div className="analytics__content__chart">
                  <div className="analytics__content__chart__headline">
                    <h2>B-Bucks im</h2>
                    <h2>
                      {chartMonthTimespans && (
                        <IonSelect
                          interface="popover"
                          value={chartFilterMonth}
                          onIonChange={(e) =>
                            setChartFilterMonth(e.detail.value)
                          }
                          placeholder="Jahr"
                        >
                          {chartMonthTimespans?.map((span) => {
                            const month = new Date();
                            month.setMonth(span);
                            return (
                              <IonSelectOption
                                value={span}
                                key={JSON.stringify(span)}
                              >
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
                          label={{
                            value: '∅',
                            position: 'right',
                          }}
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
                  {!isGuest && (
                    <IonInfiniteScroll
                      onIonInfinite={loadInfinite}
                      className="leaderboard__infinite-scroll-loading"
                    >
                      <IonInfiniteScrollContent
                        loadingSpinner="crescent"
                        loadingText="Mehr Aktivitäten laden..."
                      ></IonInfiniteScrollContent>
                    </IonInfiniteScroll>
                  )}
                </div>
              </>
            )}
          </GuestLock>
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
