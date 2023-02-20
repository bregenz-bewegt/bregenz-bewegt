import { BackButton, Chart } from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { useIsGuest } from '@bregenz-bewegt/client/common/hooks';
import {
  chatStore,
  ChatStore,
  friendsStore,
  FriendsStore,
  userStore,
  UserStore,
} from '@bregenz-bewegt/client/common/stores';
import { ActivityChartData, User } from '@bregenz-bewegt/client/types';
import type {
  CompetitorDetail,
  CompetitorFriendStatus,
} from '@bregenz-bewegt/shared/types';
import {
  IonAvatar,
  IonButton,
  IonContent,
  IonFooter,
  IonGrid,
  IonPage,
  IonRow,
  IonSkeletonText,
  IonText,
  useIonRouter,
  useIonViewWillEnter,
} from '@ionic/react';
import { UserRemove } from 'iconsax-react';
import { inject, observer } from 'mobx-react';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './competitor-profile.scss';

interface MatchParams {
  username: User['username'];
}

interface CompetitorProfileProps extends RouteComponentProps<MatchParams> {
  userStore?: UserStore;
  friendsStore?: FriendsStore;
  chatStore?: ChatStore;
}

export const CompetitorProfile: React.FC<CompetitorProfileProps> = inject(
  userStore.storeKey,
  friendsStore.storeKey,
  chatStore.storeKey
)(
  observer(({ userStore, friendsStore, chatStore, match }) => {
    const history = useIonRouter();
    const defaultRouterLink = tabRoutes.start.route;
    const [competitorProfile, setCompetitorProfile] =
      useState<CompetitorDetail>();
    const [competitorChartData, setCompetitorChartData] =
      useState<ActivityChartData>();
    const [competitorFriendStatus, setCompetitorFriendStatus] =
      useState<CompetitorFriendStatus>();
    const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
    const [isGuest] = useIsGuest();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const reloadCompetitor = (username: User['username']) => {
      userStore
        ?.fetchCompetitorProfile(username)
        .then((data) => {
          if (!data.preferences.public) {
            history.canGoBack()
              ? history.goBack()
              : history.push(defaultRouterLink, 'back');
            return;
          }
          setCompetitorProfile(data);

          userStore
            ?.fetchCompetitorFriendStatus(username)
            .then((data) => data && setCompetitorFriendStatus(data));
        })
        .catch(() => {
          history.canGoBack()
            ? history.goBack()
            : history.push(defaultRouterLink, 'back');
        });
    };

    useIonViewWillEnter(() => {
      const username = match.params.username;

      if (!username || isGuest) {
        history.canGoBack()
          ? history.goBack()
          : history.push(defaultRouterLink, 'back');
      }

      userStore?.fetchProfile().then((u) => {
        u.username === username &&
          window.location.replace(tabRoutes.profile.route);
      });

      reloadCompetitor(username);

      userStore
        ?.fetchCompetitorChartData(username)
        .then((data) => data && data.length > 0 && setCompetitorChartData(data))
        .catch();

      setIsLoading(false);
    });

    return (
      <IonPage className="competitor-profile">
        <IonContent className="competitor-profile__content">
          <BackButton defaultRouterLink={defaultRouterLink} invertColor />
          <IonGrid>
            <IonRow className="competitor-profile__content__avatar ion-justify-content-center">
              <IonAvatar>
                <img
                  onLoad={() => setIsImageLoaded(true)}
                  src={
                    competitorProfile?.profilePicture ??
                    userStore?.getAvatarProfilePictureUrl(
                      competitorProfile?.username ?? undefined
                    )
                  }
                  alt="profile"
                  style={{ display: isImageLoaded ? 'initial' : 'none' }}
                />
                {!isImageLoaded && <IonSkeletonText animated />}
              </IonAvatar>
            </IonRow>
            <IonRow className="ion-justify-content-center competitor-profile__content__username">
              <IonText>
                <h2>
                  {competitorProfile ? (
                    competitorProfile.username
                  ) : (
                    <IonSkeletonText />
                  )}
                </h2>
              </IonText>
            </IonRow>
            <IonRow className="competitor-profile__content__infos">
              {competitorProfile ? (
                <IonText>
                  {competitorProfile.firstname && competitorProfile.firstname}{' '}
                  {competitorProfile.lastname && competitorProfile.lastname}
                </IonText>
              ) : (
                <IonSkeletonText />
              )}
            </IonRow>
            <IonRow className="competitor-profile__content__infos">
              <IonText>
                {competitorProfile ? (
                  competitorProfile.biography
                ) : (
                  <IonSkeletonText />
                )}
              </IonText>
            </IonRow>

            <IonRow className="competitor-profile__content__friends">
              {competitorProfile && competitorFriendStatus ? (
                competitorFriendStatus.friends ? (
                  <>
                    {competitorFriendStatus.chat ? (
                      <IonButton
                        routerLink={
                          '/profile/chat/' + competitorProfile.username
                        }
                        mode="ios"
                      >
                        Chat öffnen
                      </IonButton>
                    ) : (
                      <IonButton
                        onClick={() =>
                          chatStore
                            ?.createConversation({
                              participantId: competitorProfile.id,
                            })
                            .then(() =>
                              history.push(
                                '/profile/chat/' + competitorProfile.username
                              )
                            )
                        }
                        mode="ios"
                        color={'primary'}
                      >
                        Chat erstellen
                      </IonButton>
                    )}
                    <IonButton
                      onClick={() =>
                        friendsStore
                          ?.removeFriend({
                            friendId: competitorProfile?.id,
                          })
                          .then(() =>
                            reloadCompetitor(competitorProfile.username)
                          )
                      }
                      mode="ios"
                      color={'danger'}
                    >
                      <UserRemove color="white" />
                    </IonButton>
                  </>
                ) : competitorFriendStatus?.recievedRequest ? (
                  <IonButton
                    onClick={() => {
                      const requestId =
                        competitorProfile.friendRequestsRelation.find(
                          (r) => r.requesteeId === competitorProfile.id
                        )?.id;

                      if (!requestId) {
                        reloadCompetitor(competitorProfile.username);
                        return;
                      }

                      friendsStore
                        ?.acceptFriendRequest({
                          requestId: requestId,
                        })
                        .then(() =>
                          reloadCompetitor(competitorProfile.username)
                        );
                    }}
                    mode="ios"
                    color={'success'}
                  >
                    Anfrage akzeptieren
                  </IonButton>
                ) : competitorFriendStatus?.requestedRequest ? (
                  <IonButton
                    onClick={() => {
                      const requestId =
                        competitorProfile.friendRequestsRelation.find(
                          (r) => r.addresseeId === competitorProfile.id
                        )?.id;

                      if (!requestId) {
                        reloadCompetitor(competitorProfile.username);
                        return;
                      }

                      friendsStore
                        ?.revokeFriendRequest({
                          requestId: requestId,
                        })
                        .then(() =>
                          reloadCompetitor(competitorProfile.username)
                        );
                    }}
                    mode="ios"
                    color={'secondary'}
                  >
                    Anfrage zurückrufen
                  </IonButton>
                ) : (
                  <IonButton
                    onClick={() =>
                      friendsStore
                        ?.sendFriendRequest({
                          addresseeId: competitorProfile.id,
                        })
                        .then(() =>
                          reloadCompetitor(competitorProfile.username)
                        )
                    }
                    mode="ios"
                    color={'primary'}
                  >
                    Freund hinzufügen
                  </IonButton>
                )
              ) : (
                <IonSkeletonText />
              )}
            </IonRow>
            <IonRow className="competitor-profile__content__chart">
              <h2>
                B-Bucks im{' '}
                {new Date().toLocaleString('default', {
                  month: 'long',
                })}
              </h2>
              {competitorChartData ? (
                <Chart
                  chartData={competitorChartData}
                  chartFilterMonth={new Date().getMonth()}
                />
              ) : isLoading ? (
                <IonSkeletonText />
              ) : (
                <IonText>Keine Statistik für diesen Monat verfügbar</IonText>
              )}
            </IonRow>
            <IonFooter>
              <IonRow className="ion-justify-content-center account-created">
                <IonText color="medium">
                  {competitorProfile ? (
                    'Konto erstellt am ' +
                    new Date(
                      competitorProfile.registratedAt
                    ).toLocaleDateString('de-DE', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  ) : (
                    <IonSkeletonText />
                  )}
                </IonText>
              </IonRow>
            </IonFooter>
          </IonGrid>
        </IonContent>
      </IonPage>
    );
  })
);
