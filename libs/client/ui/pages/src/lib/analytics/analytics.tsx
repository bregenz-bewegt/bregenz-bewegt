import {
  ActivityCard,
  GuestLock,
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
    const guestMockList = [
      {
        id: 'cld4jzgsr0519i4lfqzevc487',
        startedAt: '2023-01-20T13:24:08.522Z',
        endedAt: '2023-01-20T13:24:09.805Z',
        exerciseId: 5,
        parkId: 7,
        userId: 'cld1makuv0012xclfxfsn8tzs',
        park: {
          id: 7,
          qr: 'not-yet-defined-6',
          name: 'Tschutterplatz beim Stadion',
          address: 'Rotfarbgasse 14a, 6900 Bregenz',
          image: 'parks/tschutterplatz-beim-stadion.png',
          gmaps: null,
        },
        exercise: {
          id: 5,
          name: 'Squat',
          description: 'some description',
          execution: 'some execution detials',
          muscles: 'some muscles that are used',
          video: 'exercises/situp.mp4',
          coins: 10,
          difficultyId: 1,
          difficulty: 'BEGINNER',
        },
        minutes: '00',
        seconds: '01',
      },
      {
        id: 'cld4jzd820501i4lfm6xokyw0',
        startedAt: '2023-01-20T13:24:03.889Z',
        endedAt: '2023-01-20T13:24:05.375Z',
        exerciseId: 4,
        parkId: 7,
        userId: 'cld1makuv0012xclfxfsn8tzs',
        park: {
          id: 7,
          qr: 'not-yet-defined-6',
          name: 'Tschutterplatz beim Stadion',
          address: 'Rotfarbgasse 14a, 6900 Bregenz',
          image: 'parks/tschutterplatz-beim-stadion.png',
          gmaps: null,
        },
        exercise: {
          id: 4,
          name: 'Versteinerte Hexe',
          description: 'some description',
          execution: 'some execution detials',
          muscles: 'some muscles that are used',
          video: 'exercises/situp.mp4',
          coins: 10,
          difficultyId: 3,
          difficulty: 'GAME',
        },
        minutes: '00',
        seconds: '01',
      },
      {
        id: 'cld4jz8wu0484i4lfdn8a5u9t',
        startedAt: '2023-01-20T13:23:58.299Z',
        endedAt: '2023-01-20T13:23:59.787Z',
        exerciseId: 1,
        parkId: 7,
        userId: 'cld1makuv0012xclfxfsn8tzs',
        park: {
          id: 7,
          qr: 'not-yet-defined-6',
          name: 'Tschutterplatz beim Stadion',
          address: 'Rotfarbgasse 14a, 6900 Bregenz',
          image: 'parks/tschutterplatz-beim-stadion.png',
          gmaps: null,
        },
        exercise: {
          id: 1,
          name: 'Liegestütze',
          description: 'some description',
          execution: 'some execution detials',
          muscles: 'some muscles that are used',
          video: 'exercises/situp.mp4',
          coins: 10,
          difficultyId: 1,
          difficulty: 'BEGINNER',
        },
        minutes: '00',
        seconds: '01',
      },
      {
        id: 'cld4jz4tc0467i4lfo9hr01gu',
        startedAt: '2023-01-20T13:23:52.989Z',
        endedAt: '2023-01-20T13:23:54.963Z',
        exerciseId: 1,
        parkId: 7,
        userId: 'cld1makuv0012xclfxfsn8tzs',
        park: {
          id: 7,
          qr: 'not-yet-defined-6',
          name: 'Tschutterplatz beim Stadion',
          address: 'Rotfarbgasse 14a, 6900 Bregenz',
          image: 'parks/tschutterplatz-beim-stadion.png',
          gmaps: null,
        },
        exercise: {
          id: 1,
          name: 'Liegestütze',
          description: 'some description',
          execution: 'some execution detials',
          muscles: 'some muscles that are used',
          video: 'exercises/situp.mp4',
          coins: 10,
          difficultyId: 1,
          difficulty: 'BEGINNER',
        },
        minutes: '00',
        seconds: '01',
      },
      {
        id: 'cld4jyupg0447i4lf07cbci5a',
        startedAt: '2023-01-20T13:23:39.890Z',
        endedAt: '2023-01-20T13:23:42.013Z',
        exerciseId: 1,
        parkId: 7,
        userId: 'cld1makuv0012xclfxfsn8tzs',
        park: {
          id: 7,
          qr: 'not-yet-defined-6',
          name: 'Tschutterplatz beim Stadion',
          address: 'Rotfarbgasse 14a, 6900 Bregenz',
          image: 'parks/tschutterplatz-beim-stadion.png',
          gmaps: null,
        },
        exercise: {
          id: 1,
          name: 'Liegestütze',
          description: 'some description',
          execution: 'some execution detials',
          muscles: 'some muscles that are used',
          video: 'exercises/situp.mp4',
          coins: 10,
          difficultyId: 1,
          difficulty: 'BEGINNER',
        },
        minutes: '00',
        seconds: '02',
      },
      {
        id: 'cld1mal7a1442xclfssxrhnj7',
        startedAt: '2023-01-17T20:09:03.347Z',
        endedAt: '2023-01-17T20:09:03.347Z',
        exerciseId: 5,
        parkId: 7,
        userId: 'cld1makuv0012xclfxfsn8tzs',
        park: {
          id: 7,
          qr: 'not-yet-defined-6',
          name: 'Tschutterplatz beim Stadion',
          address: 'Rotfarbgasse 14a, 6900 Bregenz',
          image: 'parks/tschutterplatz-beim-stadion.png',
          gmaps: null,
        },
        exercise: {
          id: 5,
          name: 'Squat',
          description: 'some description',
          execution: 'some execution detials',
          muscles: 'some muscles that are used',
          video: 'exercises/situp.mp4',
          coins: 10,
          difficultyId: 1,
          difficulty: 'BEGINNER',
        },
        minutes: '00',
        seconds: '00',
      },
      {
        id: 'cld1mal7a1441xclfoja3h97m',
        startedAt: '2023-01-16T11:48:00.628Z',
        endedAt: '2023-01-16T11:48:00.628Z',
        exerciseId: 4,
        parkId: 7,
        userId: 'cld1makuv0012xclfxfsn8tzs',
        park: {
          id: 7,
          qr: 'not-yet-defined-6',
          name: 'Tschutterplatz beim Stadion',
          address: 'Rotfarbgasse 14a, 6900 Bregenz',
          image: 'parks/tschutterplatz-beim-stadion.png',
          gmaps: null,
        },
        exercise: {
          id: 4,
          name: 'Versteinerte Hexe',
          description: 'some description',
          execution: 'some execution detials',
          muscles: 'some muscles that are used',
          video: 'exercises/situp.mp4',
          coins: 10,
          difficultyId: 3,
          difficulty: 'GAME',
        },
        minutes: '00',
        seconds: '00',
      },
      {
        id: 'cld1mal7a1436xclfz70rwrwy',
        startedAt: '2023-01-14T02:42:27.138Z',
        endedAt: '2023-01-14T02:42:27.138Z',
        exerciseId: 3,
        parkId: 4,
        userId: 'cld1makuv0012xclfxfsn8tzs',
        park: {
          id: 4,
          qr: 'not-yet-defined-3',
          name: 'Generationen Park Mariahilf',
          address: 'Rotfarbgasse 14a, 6900 Bregenz',
          image: 'parks/generationen-park-mariahilf.png',
          gmaps: null,
        },
        exercise: {
          id: 3,
          name: 'Sit-Up',
          description: 'some description',
          execution: 'some execution detials',
          muscles: 'some muscles that are used',
          video: 'exercises/situp.mp4',
          coins: 10,
          difficultyId: 1,
          difficulty: 'BEGINNER',
        },
        minutes: '00',
        seconds: '00',
      },
      {
        id: 'cld1mal791433xclfzddccaef',
        startedAt: '2023-01-03T22:19:56.870Z',
        endedAt: '2023-01-03T22:19:56.870Z',
        exerciseId: 2,
        parkId: 1,
        userId: 'cld1makuv0012xclfxfsn8tzs',
        park: {
          id: 1,
          qr: 'not-yet-defined-0',
          name: 'Parkourpark Remise',
          address: 'Badgässele',
          image: 'parks/parkourpark-remise.png',
          gmaps: null,
        },
        exercise: {
          id: 2,
          name: 'Plank',
          description: 'some description',
          execution: 'some execution detials',
          muscles: 'some muscles that are used',
          video: 'exercises/situp.mp4',
          coins: 10,
          difficultyId: 2,
          difficulty: 'ADVANCED',
        },
        minutes: '00',
        seconds: '00',
      },
      {
        id: 'cld1mal791430xclfc3vd7kke',
        startedAt: '2023-01-03T02:59:51.765Z',
        endedAt: '2023-01-03T02:59:51.765Z',
        exerciseId: 1,
        parkId: 5,
        userId: 'cld1makuv0012xclfxfsn8tzs',
        park: {
          id: 5,
          qr: 'not-yet-defined-4',
          name: 'Schulsportplatz VS Weidach',
          address: 'Rotfarbgasse 14a, 6900 Bregenz',
          image: 'parks/schulsportplatz-vs-weidach.png',
          gmaps: null,
        },
        exercise: {
          id: 1,
          name: 'Liegestütze',
          description: 'some description',
          execution: 'some execution detials',
          muscles: 'some muscles that are used',
          video: 'exercises/situp.mp4',
          coins: 10,
          difficultyId: 1,
          difficulty: 'BEGINNER',
        },
        minutes: '00',
        seconds: '00',
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
      console.log(activityList);
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
          scrollY={true}
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
                    <h2>Münzen im</h2>
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
