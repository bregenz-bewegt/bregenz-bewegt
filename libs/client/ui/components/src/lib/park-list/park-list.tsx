import { useEffect, useState } from 'react';
import {
  ParkCard,
  TransitionBlock,
} from '@bregenz-bewegt/client-ui-components';
import { IonSearchbar, IonText } from '@ionic/react';
import './park-list.scss';
import {
  IonSearchbarCustomEvent,
  SearchbarChangeEventDetail,
} from '@ionic/core';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { Park } from '@bregenz-bewegt/client/types';

export interface ParkListProps {
  isLoadingParks: boolean;
  parks: Park[];
}

export const ParkList: React.FC<ParkListProps> = ({
  isLoadingParks,
  parks,
}: ParkListProps) => {
  const [searchText, setSearchText] = useState<string>('');
  const [searchResult, setSearchResult] = useState<Park[]>(parks);

  const handleSearch = (
    e: IonSearchbarCustomEvent<SearchbarChangeEventDetail>
  ) => {
    setSearchText(e.detail.value ?? searchText);

    const query = e.detail.value?.trim().toLowerCase();
    if (!query) return setSearchResult(parks);

    const queriedParks = parks.filter(
      (park) =>
        park.name.toLowerCase().includes(query) ||
        park.address.toLowerCase().includes(query)
    );

    setSearchResult(queriedParks ?? parks);
  };

  useEffect(() => {
    setSearchResult(parks);
  }, [parks]);

  return (
    <>
      <IonSearchbar
        mode="ios"
        value={searchText}
        onIonChange={(e) => handleSearch(e)}
        debounce={250}
        placeholder="Suche nach Spielplätzen"
        className="park-list__searchbar"
      ></IonSearchbar>
      <div className="park-list__list">
        {searchResult.length > 0 ? (
          <>
            <TransitionBlock />
            {searchResult.map((park) => (
              <ParkCard
                isLoading={isLoadingParks}
                title={park.name}
                location={park.address}
                image={park.image}
                link={`${tabRoutes.start.route}/${park.id}`}
              />
            ))}
          </>
        ) : (
          <IonText>
            <p>Keine Suchergebnisse gefunden</p>
          </IonText>
        )}
      </div>
    </>
  );
};
