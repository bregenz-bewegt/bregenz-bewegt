import { useState } from 'react';
import { Header } from '@bregenz-bewegt/client-ui-components';
import {
  IonContent,
  IonItem,
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
        <IonItem>
          <IonText>
            <h2>Spielplätze</h2>
          </IonText>
          <IonSelect value={parkDisplayType}>
            <IonSelectOption value={ParkDisplayType.List}>
              Listenansicht
            </IonSelectOption>
            <IonSelectOption value={ParkDisplayType.Map}>
              Kartenansicht
            </IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonSearchbar
          value={searchText}
          onIonChange={(e) => setSearchText(e.detail.value ?? searchText)}
          placeholder="Suche nach Spielplätzen"
        ></IonSearchbar>
      </IonContent>
    </IonPage>
  );
};
