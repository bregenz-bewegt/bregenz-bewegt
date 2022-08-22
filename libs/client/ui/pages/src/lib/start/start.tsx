import { useState } from 'react';
import { Header } from '@bregenz-bewegt/client-ui-components';
import {
  IonContent,
  IonPage,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonText,
} from '@ionic/react';
import { ParkDisplayType } from '@bregenz-bewegt/client/types';

import './start.scss';

export const Start: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [parkDisplayType, setParkDisplayType] = useState<ParkDisplayType>(
    ParkDisplayType.List
  );

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
        <IonSelect value={ParkDisplayType.List}>
          <IonSelectOption value={ParkDisplayType.List}>
            Listenansicht
          </IonSelectOption>
          <IonSelectOption value={ParkDisplayType.Map}>
            Kartenansicht
          </IonSelectOption>
        </IonSelect>
      </IonContent>
    </IonPage>
  );
};
