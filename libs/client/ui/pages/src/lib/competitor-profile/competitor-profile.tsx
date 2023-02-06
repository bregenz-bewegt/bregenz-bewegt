import { BackButton, Chart } from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { useIsGuest } from '@bregenz-bewegt/client/common/hooks';
import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import { ActivityChartData, User } from '@bregenz-bewegt/client/types';
import {
  CompetitorDetail,
  CompetitorFriendStatus,
} from '@bregenz-bewegt/shared/types';
import {
  IonAvatar,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  IonSkeletonText,
  IonText,
  useIonRouter,
  useIonViewWillEnter,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './competitor-profile.scss';

interface MatchParams {
  username: User['username'];
}

interface CompetitorProfileProps extends RouteComponentProps<MatchParams> {
  userStore?: UserStore;
}

export const CompetitorProfile: React.FC<CompetitorProfileProps> = inject(
  userStore.storeKey
)(
  observer(({ userStore, match }) => {
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

      userStore
        ?.fetchCompetitorFriendStatus(username)
        .then((data) => data && setCompetitorFriendStatus(data));
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
              <IonText className="profile__content__username">
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
                Befreundet seit / Konto erstellt am{' '}
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
            <IonRow>
              {competitorFriendStatus && JSON.stringify(competitorFriendStatus)}
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
