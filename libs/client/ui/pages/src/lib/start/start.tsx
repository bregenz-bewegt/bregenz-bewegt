import { Header } from '@bregenz-bewegt/client-ui-components';
import { IonContent, IonPage, IonSearchbar, IonText } from '@ionic/react';
import { useState } from 'react';
import './start.scss';

export const Start: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');

  return (
    <IonPage className="start">
      <Header></Header>
      <IonContent fullscreen className="start__content">
        <IonText>
          <h2>Spielplätze</h2>
        </IonText>
        <IonSearchbar
          value={searchText}
          onIonChange={(e) => setSearchText(e.detail.value ?? searchText)}
          placeholder="Suche nach Spielplätzen"
        ></IonSearchbar>
      </IonContent>
    </IonPage>
  );
};
