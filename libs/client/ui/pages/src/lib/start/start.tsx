import { Header } from '@bregenz-bewegt/client-ui-components';
import { IonContent, IonPage, IonSearchbar } from '@ionic/react';
import './start.scss';

export const Start: React.FC = () => {
  return (
    <IonPage>
      <Header></Header>
      <IonContent fullscreen>
        <IonSearchbar></IonSearchbar>
      </IonContent>
    </IonPage>
  );
};
