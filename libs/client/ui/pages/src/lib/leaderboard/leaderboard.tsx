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
  IonAvatar,
  IonCol,
  IonContent,
  IonGrid,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
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
import { faker } from '@faker-js/faker';
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

    const fetchCompetitor = () => {
      leaderboardStore
        ?.getCompetitor({ year: timespan })
        .then((data) => {
          setCompetitor(data);
          setIsLoading(false);
        })
        .catch(() => {
          setCompetitor(undefined);
          setIsLoading(false);
        });
    };

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
          fetchCompetitor();
        })
        .catch(() => {
          setLeaderboard([]);
          setIsLoading(false);
        });
    };

    useEffect(() => {
      if (isGuest) return setIsLoading(false);

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

    useIonViewWillEnter(() => {
      if (isGuest) return setIsLoading(false);

      fetchLeaderboardWithCompetitor({
        skip: 0,
        take: leaderboard.length,
        year: timespan,
      });
    }, [leaderboard.length, timespan]);

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
        <IonContent scrollY={!isGuest}>
          {!isGuest && <CoinDepot competitor={competitor} />}
          <GuestLock
            text={
              'Melde dich bei deinem Konto an, um B-Bucks zu verdienen und die Rangliste freizuschalten'
            }
          >
            {(isGuest) => {
              const data: LeaderboardType = isGuest
                ? new Array(15).fill(null).map((_, i) => ({
                    username: faker.internet.userName(),
                    coins: 0,
                  }))
                : leaderboard;
              return (
                <>
                  <IonRow className="ion-align-items-center ion-justify-content-between leaderboard__ranking-title">
                    <IonCol>
                      <IonText>
                        <h2>Rangliste</h2>
                        {isGuest && <br />}
                      </IonText>
                    </IonCol>
                    <IonCol size="auto">
                      {filterTimespans && !isGuest && (
                        <IonSelect
                          interface="popover"
                          value={timespan}
                          onIonChange={(e) => setTimespan(e.detail.value)}
                          placeholder="Jahr"
                        >
                          {filterTimespans?.map((span) => (
                            <IonSelectOption key={span} value={span}>
                              {span}
                            </IonSelectOption>
                          ))}
                        </IonSelect>
                      )}
                    </IonCol>
                  </IonRow>

                  <IonGrid className="leaderboard__table" fixed>
                    {data.length > 0 &&
                      data?.map((user, i) => (
                        <IonRow
                          key={i}
                          className={`ion-align-items-center ion-justify-content-between ${
                            user.username === userStore?.user?.username
                              ? ' self'
                              : ''
                          }`}
                        >
                          <IonCol size="0">
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
                          <IonCol size="9">
                            <IonItem
                              routerLink={
                                user.username === userStore?.user?.username
                                  ? undefined
                                  : '/users/' + user.username
                              }
                              lines="none"
                            >
                              <IonAvatar className="avatar">
                                {isLoading ? (
                                  <IonSkeletonText animated />
                                ) : (
                                  <img
                                    src={
                                      user.profilePicture ??
                                      userStore?.getAvatarProfilePictureUrl(
                                        user.username
                                      )
                                    }
                                    alt="avatar"
                                  />
                                )}
                              </IonAvatar>
                              <div className="username">
                                {isLoading ? (
                                  <IonSkeletonText animated />
                                ) : (
                                  user.username
                                )}
                              </div>
                            </IonItem>
                          </IonCol>
                          <IonCol size="auto">
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
                        <IonRow className="ion-align-items-center ion-justify-content-between self snack-bottom">
                          <IonCol size="0">
                            <div className="rank-medal">
                              #{competitor?.rank}
                            </div>
                          </IonCol>
                          <IonCol size="9">
                            <IonItem lines="none">
                              <IonAvatar className="avatar">
                                <img
                                  src={
                                    competitor?.profilePicture ??
                                    userStore?.getAvatarProfilePictureUrl(
                                      competitor?.username
                                    )
                                  }
                                  alt="avatar"
                                />
                              </IonAvatar>
                              <div className="username">
                                {competitor?.username}
                              </div>
                            </IonItem>
                          </IonCol>
                          <IonCol size="auto">{competitor?.coins}</IonCol>
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
                </>
              );
            }}
          </GuestLock>
        </IonContent>
      </IonPage>
    );
  })
);
