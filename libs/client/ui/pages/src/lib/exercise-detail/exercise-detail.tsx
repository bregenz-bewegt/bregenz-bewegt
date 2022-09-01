import './exercise-detail.scss';
import { IonContent, IonPage, IonTitle } from '@ionic/react';
import { Header } from '@bregenz-bewegt/client-ui-components';

export const ExerciseDetail = () => {
  return (
    <IonPage className="exercise-detail">
      <Header />
      <IonContent>
        <IonTitle>Test</IonTitle>
      </IonContent>
    </IonPage>
  );
};
