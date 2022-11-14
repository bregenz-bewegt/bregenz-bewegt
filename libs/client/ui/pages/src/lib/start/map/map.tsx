import { Park } from '@bregenz-bewegt/client/types';
import { useEffect, useState } from 'react';
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
import { closeCircleOutline, close } from 'ionicons/icons';
import { IonButton, IonRouterLink, useIonToast } from '@ionic/react';
import { icon, LocationEvent } from 'leaflet';
import { Gps, GpsSlash } from 'iconsax-react';
import './map.scss';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import pin from './img/location-sharp.png';

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
          buttons: [{ icon: close, role: 'cancel' }],
        });
      },
    });

    map.locate({ enableHighAccuracy: true, watch: true });

    return location?.latlng ? (
      <Circle center={location.latlng} radius={location.accuracy}>
        <Popup>Du bist hier</Popup>
      </Circle>
    ) : null;
  }

  const GoToLocation = () => {
    const map = useMap();
    return (
      <IonButton
        onClick={() => location && map.flyTo(location.latlng, 15)}
        disabled={!location?.latlng}
        className="start__content__map__gotolocation"
        shape="round"
      >
        <span slot="icon-only">
          {location?.latlng ? (
            <Gps variant="Linear" size={32} />
          ) : (
            <GpsSlash variant="Linear" size={32} />
          )}
        </span>
      </IonButton>
    );
  };

  const customPin = icon({
    iconUrl: pin,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -20],
  });

  return (
    <div className="start__content__map">
      <MapContainer
        center={[47.497262, 9.727287]}
        zoom={13}
        scrollWheelZoom={false}
        placeholder={<Loading />}
        touchZoom={true}
      >
        <TileLayer
          url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          attribution='&copy; <a href="https://www.google.com/intl/de_at/help/terms_maps/">Google Maps</a>'
          maxZoom={18}
          minZoom={11}
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
        />
        {parkPins.map(
          (p, i) =>
            p.coordinates && (
              <Marker
                key={i}
                position={[p.coordinates?.latitude, p.coordinates?.longitude]}
                icon={customPin}
              >
                <Popup
                  className="start__content__map__popup"
                  minWidth={200}
                  maxWidth={200}
                >
                  <IonRouterLink
                    routerLink={`${tabRoutes.start.route}/${p.id}`}
                    routerDirection="forward"
                    className="start__content__map__popup__link"
                  >
                    <img src={p.image} alt={'Bild des Parkes ' + p.name} />
                    <div>{p.name}</div>
                  </IonRouterLink>
                </Popup>
              </Marker>
            )
        )}
        <LocationMarker />
        <GoToLocation />
      </MapContainer>
    </div>
  );
};
