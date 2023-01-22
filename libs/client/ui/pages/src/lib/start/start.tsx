import { useEffect, useState } from 'react';
import { Header } from '@bregenz-bewegt/client-ui-components';
import {
  IonContent,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonText,
} from '@ionic/react';
import { Park, ParkDisplaySegment } from '@bregenz-bewegt/client/types';
import './start.scss';
import { parkStore, ParkStore } from '@bregenz-bewegt/client/common/stores';
import { inject, observer } from 'mobx-react';
import { Map } from './map/map';
import { List } from './list/list';

interface StartProps {
  parkStore?: ParkStore;
}

export const Start: React.FC<StartProps> = inject(parkStore.storeKey)(
  observer(({ parkStore }) => {
    const [isLoadingParks, setIsLoadingParks] = useState<boolean>(false);
    const [parks, setParks] = useState<Park[]>(
      Array<Park>(10).fill({
        id: 0,
        name: '',
        address: '',
        image: '',
        qr: '',
        gmaps: '',
        coordinates: { id: 0, latitude: 0, longitude: 0, toleranceRadius: 0 },
        exercises: [],
      })
    );
    const [parkDisplayType, setParkDisplayType] = useState<ParkDisplaySegment>(
      ParkDisplaySegment.List
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
              setParkDisplayType(e.detail.value as ParkDisplaySegment)
            }
            mode="ios"
            className="start__content__segment"
          >
            <IonSegmentButton value={ParkDisplaySegment.List}>
              Liste
            </IonSegmentButton>
            <IonSegmentButton value={ParkDisplaySegment.Map}>
              Karte
            </IonSegmentButton>
          </IonSegment>
          {parks.length > 0 ? (
            parkDisplayType === ParkDisplaySegment.List ? (
              <List isLoadingParks={isLoadingParks} parks={parks} />
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
