import { ExploreContainer } from '@bregenz-bewegt/client-ui-components';
import {
  IonPage,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/react';
import './login.scss';
import { scan } from 'ionicons/icons';

/* eslint-disable-next-line */
export interface LoginProps {}

export const Login: React.FC = (props: LoginProps) => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <ExploreContainer name="Leaderboard" />
      </IonContent>
    </IonPage>
  );
};
