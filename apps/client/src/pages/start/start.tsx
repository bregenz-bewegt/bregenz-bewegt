import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import ExploreContainer from '../../components/ExploreContainer';
import './start.scss';

const Start: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Start</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Start</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Scan" />
      </IonContent>
    </IonPage>
  );
};

export default Start;
