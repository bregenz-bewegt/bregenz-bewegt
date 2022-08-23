import { useEffect, useState } from 'react';
import { Header, ParkCard } from '@bregenz-bewegt/client-ui-components';
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
import { ParkStore } from '@bregenz-bewegt/client/common/stores';
import { inject, observer } from 'mobx-react';

interface StartProps {
  parkStore?: ParkStore;
}

export const Start: React.FC<StartProps> = inject(ParkStore.storeKey)(
  observer(({ parkStore }) => {
    const [searchText, setSearchText] = useState<string>('');
    const [parkDisplayType, setParkDisplayType] = useState<ParkDisplayType>(
      ParkDisplayType.List
    );

    useEffect(() => {
      parkStore?.fetchParks();
    }, []);

    return (
      <IonPage className="start">
        <Header></Header>
        <IonContent className="start__content">
          <div className="start__content__scroll-wrapper">
            <div className="start__content__title-wrapper">
              <IonText>
                <h2>Spielplätze</h2>
              </IonText>
              <IonSelect
                interface="popover"
                value={parkDisplayType}
                className="start__content__display-type-select"
                onIonChange={(e) => setParkDisplayType(e.detail.value)}
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
            {parkDisplayType === ParkDisplayType.List ? (
              <div className="start__content__parks-list">
                {parkStore?.parks && parkStore.parks.length > 0
                  ? parkStore.parks.map((park) => {
                      return (
                        <ParkCard
                          title={park.name}
                          location={park.address}
                          image={park.image}
                          description={park.description}
                          link="#"
                        />
                      );
                    })
                  : 'Spielplätze laden'}
              </div>
            ) : (
              <IonText>Map</IonText>
            )}
          </div>
        </IonContent>
      </IonPage>
    );
  })
);
