import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { UserStore } from '@bregenz-bewegt/client/common/stores';
import { User } from '@bregenz-bewegt/client/types';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './competitor-profile.scss';

interface MatchParams {
  id: User['id'];
}

interface CompetitorProfileProps extends RouteComponentProps<MatchParams> {
  userStore?: UserStore;
}

export const CompetitorProfile: React.FC<CompetitorProfileProps> = ({
  match,
}) => {
  const router = useIonRouter();
  const navigateBackToProfile = () => router.push(`${tabRoutes.profile.route}`);

  useEffect(() => {
    const userId = match.params.id;

    if (!userId) {
      return navigateBackToProfile();
    }
  }, []);

  return (
    <IonPage className="competitor-profile">
      <IonHeader mode="ios">
        <IonToolbar>
          <IonButtons>
            <IonBackButton
              color="primary"
              defaultHref={`${tabRoutes.profile.route}/friends`}
              text="Zurück"
            />
          </IonButtons>
          <IonTitle>Benutzer</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent
        className="competitor-profile__content"
        fullscreen
        scrollY={false}
      >
        Benutzer
      </IonContent>
    </IonPage>
  );
};
