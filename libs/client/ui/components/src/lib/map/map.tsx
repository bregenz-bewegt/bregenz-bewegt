import { Park } from '@bregenz-bewegt/client/types';
import { useEffect, useState } from 'react';
import './map.scss';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Loading } from '@bregenz-bewegt/client-ui-pages';

export interface MapProps {
  parks: Park[];
}

export const Map: React.FC<MapProps> = ({ parks }: MapProps) => {
  const [parkPins, setParkPins] = useState<Park[]>(parks);
  useEffect(() => {
    setParkPins(parks);
  }, [parks]);
  return (
    <div className="map">
      <MapContainer
        center={[47.497262, 9.727287]}
        zoom={13}
        scrollWheelZoom={false}
        placeholder={<Loading />}
      >
        <TileLayer
          url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          attribution='&copy; <a href="https://www.google.com/intl/de_at/help/terms_maps/">Google Maps</a> contributors'
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
      </MapContainer>
    </div>
  );
};
