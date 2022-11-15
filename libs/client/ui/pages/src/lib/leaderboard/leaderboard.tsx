import {
  CoinDepot,
  GuestLock,
  Header,
} from '@bregenz-bewegt/client-ui-components';
import { useIsGuest } from '@bregenz-bewegt/client/common/hooks';
import {
  leaderboardStore,
  LeaderboardStore,
  userStore,
  UserStore,
} from '@bregenz-bewegt/client/common/stores';
import {
  Competitor,
  Leaderboard as LeaderboardType,
  LeaderboardFilterTimespans,
  LeaderboardPaginationQueryDto,
} from '@bregenz-bewegt/shared/types';
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
  IonSkeletonText,
  IonText,
  useIonViewWillEnter,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import './leaderboard.scss';

const COMPETIORS_RELOAD_CHUNK_SIZE = 10;
const MAX_SHOWN_COMPETITORS = COMPETIORS_RELOAD_CHUNK_SIZE * 10;

export interface LeaderboardProps {
  leaderboardStore?: LeaderboardStore;
  userStore?: UserStore;
}

export const Leaderboard: React.FC<LeaderboardProps> = inject(
  leaderboardStore.storeKey,
  userStore.storeKey
)(
  observer(({ leaderboardStore, userStore }) => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardType>(
      Array<LeaderboardType extends readonly (infer T)[] ? T : never>(10).fill({
        username: '',
        coins: 0,
      })
    );
    const [competitor, setCompetitor] = useState<Competitor>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [filterTimespans, setFilterTimespans] =
      useState<LeaderboardFilterTimespans>();
    const [timespan, setTimespan] = useState<
      LeaderboardFilterTimespans[number]
    >(new Date().getFullYear());
    const [isGuest] = useIsGuest();

    const fetchLeaderboardWithCompetitor = ({
      skip,
      take,
      year,
    }: LeaderboardPaginationQueryDto) => {
      leaderboardStore
        ?.getLeaderboard({
          skip,
          take,
          year,
        })
        .then((data) => {
          setLeaderboard(data);
          leaderboardStore
            ?.getCompetitor({ year })
            .then((data) => {
              setCompetitor(data);
              setIsLoading(false);
            })
            .catch(() => {
              setCompetitor(undefined);
              setIsLoading(false);
            });
        })
        .catch(() => {
          setLeaderboard([]);
          setIsLoading(false);
        });
    };

    useEffect(() => {
      leaderboardStore
        ?.getFilterTimespans()
        .then((data) => setFilterTimespans(data))
        .catch(() => setFilterTimespans([]));

      fetchLeaderboardWithCompetitor({
        skip: 0,
        take: COMPETIORS_RELOAD_CHUNK_SIZE,
        year: timespan,
      });
    }, []);

    useEffect(() => {
      fetchLeaderboardWithCompetitor({
        skip: 0,
        take: leaderboard.length,
        year: timespan,
      });
    }, [timespan]);

    useIonViewWillEnter(() => {
      fetchLeaderboardWithCompetitor({
        skip: 0,
        take: leaderboard.length,
        year: timespan,
      });
    }, [leaderboard.length]);

    const loadInfinite = (e: any) => {
      if (leaderboard.length === MAX_SHOWN_COMPETITORS)
        return e.target.complete();

      leaderboardStore
        ?.getLeaderboard({
          skip: leaderboard.length,
          take:
            leaderboard.length + COMPETIORS_RELOAD_CHUNK_SIZE >
            MAX_SHOWN_COMPETITORS
              ? MAX_SHOWN_COMPETITORS - leaderboard.length
              : COMPETIORS_RELOAD_CHUNK_SIZE,
          year: timespan,
        })
        .then((data) => {
          setLeaderboard((prev) => [...prev, ...data]);
          e.target.complete();
        })
        .catch(() => {
          setLeaderboard([]);
          e.target.complete();
        });
    };

    return (
      <IonPage className="leaderboard">
        <Header />
        <IonContent fullscreen>
          <CoinDepot competitor={competitor} />
          <IonRow>
            <IonCol className="ion-align-center">
              <IonText>
                <h2>Rangliste</h2>
              </IonText>
            </IonCol>
            <IonCol className="ion-align-center leaderboard__timespan">
              {filterTimespans && !isGuest && (
                <IonSelect
                  interface="popover"
                  value={timespan}
                  className="leaderboard__timespan__select"
                  onIonChange={(e) => setTimespan(e.detail.value)}
                  placeholder="Jahr"
                >
                  {filterTimespans?.map((span) => (
                    <IonSelectOption value={span}>{span}</IonSelectOption>
                  ))}
                </IonSelect>
              )}
            </IonCol>
          </IonRow>
          <GuestLock
            text={
              'Melde dich bei deinem Konto an, um B-Bucks zu verdienen und die Rangliste freizuschalten'
            }
          >
            {(isGuest) => {
              const data: LeaderboardType = isGuest
                ? new Array(10)
                    .fill(null)
                    .map((_, i) => ({ username: 'User', coins: 0 }))
                : leaderboard;
              return (
                <IonGrid className="leaderboard__table">
                  {data.length > 0 &&
                    data?.map((user, i) => (
                      <IonRow
                        className={`${
                          user.username === userStore?.user?.username
                            ? 'self'
                            : ''
                        }`}
                      >
                        <IonCol size="2" className={`align-center`}>
                          <div className={`rank-medal rank-${i + 1}`}>
                            {isLoading ? (
                              <IonSkeletonText
                                style={{ height: '100%' }}
                                animated
                              />
                            ) : (
                              <>#{i + 1}</>
                            )}
                          </div>
                        </IonCol>
                        <IonCol size="8" className="align-center">
                          {isLoading ? (
                            <IonSkeletonText animated />
                          ) : (
                            user.username
                          )}
                        </IonCol>
                        <IonCol
                          size="2"
                          className="align-center ion-justify-content-end"
                        >
                          {isLoading ? (
                            <IonSkeletonText animated />
                          ) : (
                            user.coins
                          )}
                        </IonCol>
                      </IonRow>
                    ))}
                  {!isGuest &&
                    !isLoading &&
                    !leaderboard.some(
                      (user) => user.username === competitor?.username
                    ) && (
                      <IonRow className={`self snack-bottom`}>
                        <IonCol size="2" className={`align-center`}>
                          <div className={`rank-medal`}>
                            #{competitor?.rank}
                          </div>
                        </IonCol>
                        <IonCol size="8" className="align-center">
                          {competitor?.username}
                        </IonCol>
                        <IonCol
                          size="2"
                          className="align-center ion-justify-content-end"
                        >
                          {competitor?.coins}
                        </IonCol>
                      </IonRow>
                    )}
                  {!isGuest && (
                    <IonInfiniteScroll
                      onIonInfinite={loadInfinite}
                      threshold="100px"
                      className="leaderboard__infinite-scroll-loading"
                    >
                      <IonInfiniteScrollContent
                        loadingSpinner="crescent"
                        loadingText="Mehr Benutzer laden.."
                      ></IonInfiniteScrollContent>
                    </IonInfiniteScroll>
                  )}
                </IonGrid>
              );
            }}
          </GuestLock>
        </IonContent>
      </IonPage>
    );
  })
);
