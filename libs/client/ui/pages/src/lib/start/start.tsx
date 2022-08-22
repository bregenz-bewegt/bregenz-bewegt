import { Header } from '@bregenz-bewegt/client-ui-components';
import { IonContent, IonPage, IonSearchbar, IonText } from '@ionic/react';
import './start.scss';

export const Start: React.FC = () => {
  return (
    <IonPage>
      <Header></Header>
      <IonContent fullscreen>
        <IonText>
          <h2>Spielplätze</h2>
        </IonText>
        <IonSearchbar></IonSearchbar>
      </IonContent>
    </IonPage>
  );
};
