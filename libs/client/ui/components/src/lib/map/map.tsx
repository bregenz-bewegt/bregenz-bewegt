import { Park } from '@bregenz-bewegt/client/types';
import { useEffect, useState } from 'react';
import './map.scss';
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { Loading } from '@bregenz-bewegt/client-ui-pages';
import { closeCircleOutline } from 'ionicons/icons';
import { IonButton, useIonToast } from '@ionic/react';
import { LocationEvent } from 'leaflet';
import { Gps, GpsSlash } from 'iconsax-react';

export interface MapProps {
  parks: Park[];
}

export const Map: React.FC<MapProps> = ({ parks }: MapProps) => {
  const [parkPins, setParkPins] = useState<Park[]>(parks);
  const [presentToast] = useIonToast();
  const [location, setLocation] = useState<LocationEvent>();

  useEffect(() => {
    setParkPins(parks);
  }, [parks]);

  function LocationMarker() {
    const map = useMapEvents({
      locationfound(e) {
        setLocation(e);
      },
      locationerror() {
        presentToast({
          message: 'Standort wurde nicht gefunden',
          icon: closeCircleOutline,
          duration: 2000,
          position: 'top',
          mode: 'ios',
          color: 'danger',
        });
      },
    });

    map.locate();

    return location?.latlng ? (
      <Circle center={location.latlng} radius={location.accuracy}>
        <Popup>You are here</Popup>
      </Circle>
    ) : null;
  }

  const GoToLocation = () => {
    const map = useMap();
    return (
      <IonButton
        onClick={() => location && map.flyTo(location.latlng, map.getZoom())}
        disabled={!location?.latlng}
      >
        {location?.latlng ? <Gps /> : <GpsSlash />}
      </IonButton>
    );
  };

  return (
    <div className="map">
      <MapContainer
        center={[47.497262, 9.727287]}
        zoom={13}
        scrollWheelZoom={false}
        placeholder={<Loading />}
        zoomControl={false}
      >
        <TileLayer
          url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          attribution='&copy; <a href="https://www.google.com/intl/de_at/help/terms_maps/">Google Maps</a>'
          maxZoom={18}
          minZoom={12}
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
        />
        {parkPins.map(
          (p) =>
            p.coordinates && (
              <Marker
                position={[p.coordinates?.latitude, p.coordinates?.longitude]}
              >
                <Popup>{p.name}</Popup>
              </Marker>
            )
        )}
        <LocationMarker />
        <GoToLocation />
      </MapContainer>
    </div>
  );
};
