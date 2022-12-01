import { useEffect, useState } from 'react';
import { ParkCard } from '@bregenz-bewegt/client-ui-components';
import { IonSearchbar, IonText } from '@ionic/react';
import './list.scss';
import {
  IonSearchbarCustomEvent,
  SearchbarChangeEventDetail,
} from '@ionic/core';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { Park } from '@bregenz-bewegt/client/types';

export interface ListProps {
  isLoadingParks: boolean;
  parks: Park[];
}

export const List: React.FC<ListProps> = ({
  isLoadingParks,
  parks,
}: ListProps) => {
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

  console.log(parks);

  return (
    <>
      <IonSearchbar
        mode="ios"
        value={searchText}
        onIonChange={(e) => handleSearch(e)}
        debounce={250}
        placeholder="Suche nach Spielplätzen"
        className="start__content__list__searchbar"
      ></IonSearchbar>
      <div className="start__content__list__parks">
        {searchResult.length > 0 ? (
          <>
            {searchResult.map((park, i) => (
              <ParkCard
                key={i}
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
