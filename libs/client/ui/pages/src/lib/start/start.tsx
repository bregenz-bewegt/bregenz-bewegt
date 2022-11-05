import { useEffect, useState } from 'react';
import { Header, Map, ParkList } from '@bregenz-bewegt/client-ui-components';
import {
  IonContent,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonText,
} from '@ionic/react';
import { Park, ParkDisplayType } from '@bregenz-bewegt/client/types';
import './start.scss';
import { parkStore, ParkStore } from '@bregenz-bewegt/client/common/stores';
import { inject, observer } from 'mobx-react';

interface StartProps {
  parkStore?: ParkStore;
}

export const Start: React.FC<StartProps> = inject(parkStore.storeKey)(
  observer(({ parkStore }) => {
    const [isLoadingParks, setIsLoadingParks] = useState<boolean>(false);
    const [parks, setParks] = useState<Park[]>(
      Array<Park>(10).fill({ id: 0, name: '', address: '', image: '', qr: '' })
    );
    const [parkDisplayType, setParkDisplayType] = useState<ParkDisplayType>(
      ParkDisplayType.List
    );

    const fetchParks = async () => {
      setIsLoadingParks(true);
      parkStore?.getParks().then((newParks) => {
        newParks && setParks(newParks);
        setIsLoadingParks(false);
      });
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
          {parks.length > 0 ? (
            parkDisplayType === ParkDisplayType.List ? (
              <ParkList isLoadingParks={isLoadingParks} parks={parks} />
            ) : (
              <Map parks={parks} />
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
