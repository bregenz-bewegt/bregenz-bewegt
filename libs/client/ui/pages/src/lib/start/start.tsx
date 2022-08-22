import { useState } from 'react';
import { Header, ParkCard } from '@bregenz-bewegt/client-ui-components';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonList,
  IonPage,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonText,
  IonVirtualScroll,
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
      <IonContent className="start__content">
        <div className="start__content__title-wrapper">
          <IonText>
            <h2>Spielplätze</h2>
          </IonText>
          <IonSelect
            interface="popover"
            value={parkDisplayType}
            className="start__content__display-type-select"
          >
            <IonSelectOption value={ParkDisplayType.List}>
              Listenansicht
            </IonSelectOption>
            <IonSelectOption value={ParkDisplayType.Map}>
              Kartenansicht
            </IonSelectOption>
          </IonSelect>
        </div>
        <IonSearchbar
          value={searchText}
          onIonChange={(e) => setSearchText(e.detail.value ?? searchText)}
          placeholder="Suche nach Spielplätzen"
          className="start__content__search-bar"
        ></IonSearchbar>
        <div className="start__content__parks">
          <IonList>
            <ParkCard
              title="Rieden Vorkloster"
              location="Rotfarbgasse 14a, 6900 Bregenz"
              image="https://picsum.photos/400/200"
              description="Mein Lieblingsspielplatz"
              link="#"
            />
            <ParkCard
              title="Rieden Vorkloster"
              location="Rotfarbgasse 14a, 6900 Bregenz"
              image="https://picsum.photos/400/200"
              description="Mein Lieblingsspielplatz"
              link="#"
            />
            <ParkCard
              title="Rieden Vorkloster"
              location="Rotfarbgasse 14a, 6900 Bregenz"
              image="https://picsum.photos/400/200"
              description="Mein Lieblingsspielplatz"
              link="#"
            />
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
};
