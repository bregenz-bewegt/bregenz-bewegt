import { ExploreContainer } from '@bregenz-bewegt/client-ui-components';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/react';
import './login.scss';

/* eslint-disable-next-line */
export interface LoginProps {}

export const Login: React.FC = (props: LoginProps) => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Login</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Leaderboard" />
      </IonContent>
    </IonPage>
  );
};
