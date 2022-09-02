import { Header } from '@bregenz-bewegt/client-ui-components';
import {
  IonContent,
  IonPage,
} from '@ionic/react';
import './leaderboard.scss';

export const Leaderboard: React.FC = () => {
  return (
    <IonPage>
      <Header />
      <IonContent className="leaderboard" fullscreen>
        
      </IonContent>
    </IonPage>
  );
};
