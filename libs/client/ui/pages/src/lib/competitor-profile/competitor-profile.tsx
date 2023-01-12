import { BackButton } from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import { User } from '@bregenz-bewegt/client/types';
import { CompetitorDetail } from '@bregenz-bewegt/shared/types';
import {
  IonAvatar,
  IonContent,
  IonFooter,
  IonGrid,
  IonPage,
  IonRow,
  IonSkeletonText,
  IonText,
  useIonRouter,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
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
    const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

    useEffect(() => {
      const username = match.params.username;
      if (!username) {
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
          setCompetitorProfile(data);
        })
        .catch(() => {
          history.canGoBack()
            ? history.goBack()
            : history.push(defaultRouterLink, 'back');
        });
    }, []);

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
              <IonText>
                {competitorProfile ? (
                  competitorProfile.firstname
                ) : (
                  <IonSkeletonText />
                )}{' '}
                {competitorProfile ? (
                  competitorProfile.lastname
                ) : (
                  <IonSkeletonText />
                )}
              </IonText>
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
            <IonFooter>
              <IonRow className="ion-justify-content-center account-created">
                <IonText color="medium">
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
            </IonFooter>
          </IonGrid>
        </IonContent>
      </IonPage>
    );
  })
);
