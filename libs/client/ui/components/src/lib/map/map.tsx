import { Park } from '@bregenz-bewegt/client/types';
import { useEffect, useState } from 'react';
import './map.scss';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

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
      <p>In Entwicklung - Maps</p>
      <MapContainer
        center={[47.491571, 9.723747]}
        zoom={15}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          attribution='&copy; <a href="https://www.google.com/intl/de_at/help/terms_maps/">Google Maps</a> contributors'
          maxZoom={20}
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
        />
        <Marker position={[47.491571, 9.723747]}>
          <Popup>Test - HAK Bregenz</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
