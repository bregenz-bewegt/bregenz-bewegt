import { BackButton, Chart } from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { useIsGuest } from '@bregenz-bewegt/client/common/hooks';
import {
  ChatStore,
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
  userStore.storeKey
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

    const fetchFriendStatus = (username: User['username']) =>
      userStore
        ?.fetchCompetitorFriendStatus(username)
        .then((data) => data && setCompetitorFriendStatus(data));

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

      userStore
        ?.fetchCompetitorProfile(username)
        .then((data) => {
          if (!data.preferences.public) {
            history.canGoBack()
              ? history.goBack()
              : history.push(defaultRouterLink, 'back');
          } else {
            setCompetitorProfile(data);
          }
        })
        .catch(() => {
          history.canGoBack()
            ? history.goBack()
            : history.push(defaultRouterLink, 'back');
        });

      userStore
        ?.fetchCompetitorChartData(username)
        .then((data) => data && data.length > 0 && setCompetitorChartData(data))
        .catch();

      fetchFriendStatus(username);
    });

    return (
      <IonPage className="competitor-profile">
        <IonContent className="competitor-profile__content">
          <BackButton defaultRouterLink={defaultRouterLink} invertColor />
          <IonGrid>
            <IonRow className="ion-justify-content-center">
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
            <IonRow className="ion-justify-content-center">
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
            <IonRow>
              {competitorProfile ? (
                competitorProfile.firstname && competitorProfile.lastname ? (
                  <IonText>
                    {competitorProfile.firstname} {competitorProfile.lastname}
                  </IonText>
                ) : (
                  ''
                )
              ) : (
                <IonSkeletonText />
              )}
            </IonRow>
            <IonRow>
              <IonText>
                {competitorProfile ? (
                  competitorProfile.biography
                ) : (
                  <IonSkeletonText />
                )}
              </IonText>
            </IonRow>
            <IonRow>
              <IonText>
                Konto erstellt am{' '}
                {competitorProfile ? (
                  new Date(
                    competitorProfile.registratedAt as any
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
            <IonRow className="competitor-profile__content__friends">
              {competitorProfile && competitorFriendStatus ? (
                competitorFriendStatus.friends ? (
                  <>
                    {competitorFriendStatus.chat ? (
                      <IonButton
                        href={'/profile/chat/' + competitorProfile.username}
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
                                '/profile/chat' + competitorProfile.username
                              )
                            )
                        }
                        mode="ios"
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
                            history.canGoBack()
                              ? history.goBack()
                              : history.push(defaultRouterLink, 'back')
                          )
                      }
                      mode="ios"
                    >
                      <UserRemove />
                    </IonButton>
                  </>
                ) : competitorFriendStatus?.recievedRequest ? (
                  <IonButton
                    onClick={() =>
                      friendsStore
                        ?.acceptFriendRequest({
                          requestId: competitorProfile.id,
                        })
                        .then(() =>
                          fetchFriendStatus(competitorProfile.username)
                        )
                    }
                    mode="ios"
                  >
                    Anfrage akzeptieren
                  </IonButton>
                ) : competitorFriendStatus?.requestedRequest ? (
                  <IonButton
                    onClick={() =>
                      friendsStore
                        ?.revokeFriendRequest({
                          requestId: competitorProfile.id,
                        })
                        .then(() =>
                          fetchFriendStatus(competitorProfile.username)
                        )
                    }
                    mode="ios"
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
                          fetchFriendStatus(competitorProfile.username)
                        )
                    }
                    mode="ios"
                  >
                    Anfrage senden
                  </IonButton>
                )
              ) : (
                <IonSkeletonText />
              )}
            </IonRow>
            <IonRow>
              {competitorChartData ? (
                <Chart
                  chartData={competitorChartData}
                  chartFilterMonth={new Date().getMonth()}
                />
              ) : (
                <IonText>Keine Statistik für diesen Monat verfügbar</IonText>
              )}
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    );
  })
);
