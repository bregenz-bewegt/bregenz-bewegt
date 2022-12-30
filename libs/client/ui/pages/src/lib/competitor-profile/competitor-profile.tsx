import { BackButton } from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { UserStore } from '@bregenz-bewegt/client/common/stores';
import { User } from '@bregenz-bewegt/client/types';
import { IonContent, IonPage, useIonRouter } from '@ionic/react';
import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './competitor-profile.scss';

interface MatchParams {
  username: User['username'];
}

interface CompetitorProfileProps extends RouteComponentProps<MatchParams> {
  userStore?: UserStore;
}

export const CompetitorProfile: React.FC<CompetitorProfileProps> = ({
  match,
}) => {
  const history = useIonRouter();
  const defaultRouterLink = tabRoutes.start.route;

  useEffect(() => {
    const username = match.params.username;
    if (!username) {
      history.canGoBack()
        ? history.goBack()
        : history.push(defaultRouterLink, 'back');
    }
  }, []);

  return (
    <IonPage className="competitor-profile">
      <IonContent className="competitor-profile__content">
        <BackButton defaultRouterLink={defaultRouterLink} invertColor />
        <br />
        <br />
        <br />
        Benutzer
      </IonContent>
    </IonPage>
  );
};
