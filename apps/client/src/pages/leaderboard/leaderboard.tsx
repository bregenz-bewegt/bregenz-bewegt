import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import ExploreContainer from '../../components/ExploreContainer';
import './leaderboard.scss';

const Leaderboard: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Leaderboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Leaderboard</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Leaderboard" />
      </IonContent>
    </IonPage>
  );
};

export default Leaderboard;
