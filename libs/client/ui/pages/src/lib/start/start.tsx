import { useEffect, useState } from 'react';
import {
  Header,
  ParkCard,
  TransitionBlock,
} from '@bregenz-bewegt/client-ui-components';
import {
  IonContent,
  IonPage,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonText,
} from '@ionic/react';
import { Park, ParkDisplayType } from '@bregenz-bewegt/client/types';
import './start.scss';
import { parkStore, ParkStore } from '@bregenz-bewegt/client/common/stores';
import { inject, observer } from 'mobx-react';
import {
  IonSearchbarCustomEvent,
  SearchbarChangeEventDetail,
} from '@ionic/core';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';

interface StartProps {
  parkStore?: ParkStore;
}

export const Start: React.FC<StartProps> = inject(parkStore.storeKey)(
  observer(({ parkStore }) => {
    const [isLoadingParks, setIsLoadingParks] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
    const [parksResult, setParksResult] = useState<Park[]>(
      Array<Park>(10).fill({ id: 0, name: '', address: '', image: '', qr: '' })
    );
    const [parkDisplayType, setParkDisplayType] = useState<ParkDisplayType>(
      ParkDisplayType.List
    );

    const fetchParks = async () => {
      setIsLoadingParks(true);
      parkStore?.getParks().then((parks) => {
        setParksResult(parks ?? []);
        setIsLoadingParks(false);
      });
    };

    const handleSearch = (
      e: IonSearchbarCustomEvent<SearchbarChangeEventDetail>
    ) => {
      setSearchText(e.detail.value ?? searchText);

      const query = e.detail.value?.trim().toLowerCase();
      if (!query) return setParksResult(parkStore?.parks ?? parksResult);

      const queriedParks = parkStore?.parks.filter(
        (park) =>
          park.name.toLowerCase().includes(query) ||
          park.address.toLowerCase().includes(query)
      );

      setParksResult(queriedParks ?? parksResult);
    };

    useEffect(() => {
      fetchParks();
    }, []);

    return (
      <IonPage className="start">
        <Header />
        <IonContent className="start__content" scrollY={false}>
          <IonText className="start__content__title">
            <h2>Spielplätze</h2>
          </IonText>
          <IonSegment
            value={parkDisplayType}
            onIonChange={(e) =>
              setParkDisplayType(e.detail.value as ParkDisplayType)
            }
            mode="ios"
            className="start__content__segment"
          >
            <IonSegmentButton value={ParkDisplayType.List}>
              Liste
            </IonSegmentButton>
            <IonSegmentButton value={ParkDisplayType.Map}>
              Karte
            </IonSegmentButton>
          </IonSegment>
          {parksResult.length > 0 ? (
            parkDisplayType === ParkDisplayType.List ? (
              <>
                <IonSearchbar
                  mode="ios"
                  value={searchText}
                  onIonChange={(e) => handleSearch(e)}
                  debounce={250}
                  placeholder="Suche nach Spielplätzen"
                  className="start__content__searchbar"
                ></IonSearchbar>
                <div className="start__content__parks-list">
                  <TransitionBlock />
                  {parksResult.map((park) => (
                    <ParkCard
                      isLoading={isLoadingParks}
                      title={park.name}
                      location={park.address}
                      image={park.image}
                      link={`${tabRoutes.start.route}/${park.id}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <IonText>Map</IonText>
            )
          ) : (
            <IonText className="start__content__no-results">
              <p>Keine Spielplätze gefunden</p>
            </IonText>
          )}
        </IonContent>
      </IonPage>
    );
  })
);
