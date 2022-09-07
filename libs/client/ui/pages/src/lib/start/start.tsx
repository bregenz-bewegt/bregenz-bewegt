import { useEffect, useState } from 'react';
import {
  Header,
  ParkCard,
  QuickFilter,
} from '@bregenz-bewegt/client-ui-components';
import {
  IonButton,
  IonContent,
  IonPage,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonText,
} from '@ionic/react';
import {
  Difficulty,
  Park,
  ParkDisplayType,
} from '@bregenz-bewegt/client/types';
import './start.scss';
import { parkStore, ParkStore } from '@bregenz-bewegt/client/common/stores';
import { inject, observer } from 'mobx-react';
import {
  IonSearchbarCustomEvent,
  SearchbarChangeEventDetail,
} from '@ionic/core';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { difficultyDisplayTexts } from '@bregenz-bewegt/client/ui/shared/content';

interface StartProps {
  parkStore?: ParkStore;
}

export const Start: React.FC<StartProps> = inject(parkStore.storeKey)(
  observer(({ parkStore }) => {
    const [isLoadingParks, setIsLoadingParks] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
    const [parksResult, setParksResult] = useState<Park[]>(
      Array(10).fill({ id: 0, name: '', address: '', image: '', qr: '' })
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

    // TODO improve this with a fuzzy search algorithm
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

    console.log(parksResult);

    useEffect(() => {
      fetchParks();
    }, []);

    return (
      <IonPage className="start">
        <Header />
        <IonContent className="start__content" scrollY={false}>
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
            <div className="start__content__searchbar-wrapper">
              <IonSearchbar
                mode="ios"
                value={searchText}
                onIonChange={(e) => handleSearch(e)}
                debounce={250}
                placeholder="Suche nach Spielplätzen"
              ></IonSearchbar>
            </div>
            <QuickFilter
              options={[
                { key: 0, label: 'Alle', active: false },
                {
                  key: 1,
                  label: difficultyDisplayTexts[Difficulty.BEGINNER],
                  active: true,
                },
                {
                  key: 2,
                  label: difficultyDisplayTexts[Difficulty.GAME],
                  active: false,
                },
              ]}
              className="start__content__quick-filters"
            />
            , difficultyDisplayTexts[Difficulty.ADVANCED],
            {parkDisplayType === ParkDisplayType.List ? (
              <div className="start__content__parks-list">
                {parksResult.length > 0 ? (
                  parksResult.map((park) => {
                    return (
                      <ParkCard
                        isLoading={isLoadingParks}
                        title={park.name}
                        location={park.address}
                        image={park.image}
                        link={`${tabRoutes.start.route}/${park.id}`}
                      />
                    );
                  })
                ) : (
                  <IonText className="start__content__parks-list__no-results">
                    Keine Spielplätze gefunden
                  </IonText>
                )}
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
