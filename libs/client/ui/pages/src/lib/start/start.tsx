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
import { parkStore, ParkStore } from '@bregenz-bewegt/client/common/stores';
import { inject, observer } from 'mobx-react';
import {
  IonSearchbarCustomEvent,
  SearchbarChangeEventDetail,
} from '@ionic/core';

interface StartProps {
  parkStore?: ParkStore;
}

export const Start: React.FC<StartProps> = inject(parkStore.storeKey)(
  observer(({ parkStore }) => {
    const [searchText, setSearchText] = useState<string>('');
    const [parksResult, setParksResult] = useState<any[]>([]);
    const [parkDisplayType, setParkDisplayType] = useState<ParkDisplayType>(
      ParkDisplayType.List
    );

    const handleSearch = (
      e: IonSearchbarCustomEvent<SearchbarChangeEventDetail>
    ) => {
      const query = e.detail.value?.trim();
      if (!query) return;

      setSearchText(query);
    };

    useEffect(() => {
      parkStore?.fetchParks().then((parks) => setParksResult(parks ?? []));
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
              onIonChange={(e) => handleSearch(e)}
              debounce={250}
              placeholder="Suche nach Spielplätzen"
              className="start__content__search-bar"
            ></IonSearchbar>
            {parkDisplayType === ParkDisplayType.List ? (
              <div className="start__content__parks-list">
                {parksResult.length > 0
                  ? parksResult.map((park) => {
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
