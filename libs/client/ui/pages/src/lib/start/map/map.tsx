import { Park } from '@bregenz-bewegt/client/types';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { IonRouterLink } from '@ionic/react';
import { icon, LocationEvent } from 'leaflet';
import './map.scss';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import pin from './img/location-sharp.png';
import { GoToLocation, LocationMarker } from '.';

export interface MapProps {
  parks: Park[];
}

export const Map: React.FC<MapProps> = ({ parks }: MapProps) => {
  const [parkPins, setParkPins] = useState<Park[]>(parks);
  const [location, setLocation] = useState<LocationEvent>();

  useEffect(() => {
    setParkPins(parks);
  }, [parks]);

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
        <LocationMarker location={location} setLocation={setLocation} />
        <GoToLocation location={location} />
      </MapContainer>
    </div>
  );
};
