import { Park } from '@bregenz-bewegt/client/types';
import { useEffect, useState } from 'react';
import './map.scss';

export interface MapProps {
  parks: Park[];
}

export const Map: React.FC<MapProps> = ({ parks }: MapProps) => {
  const [parkPins, setParkPins] = useState<Park[]>(parks);
  useEffect(() => {
    setParkPins(parks);
  }, [parks]);
  return (
    <div>
      <p>In Entwicklung - Maps</p>
      {parkPins &&
        parkPins[1].id !== 0 &&
        JSON.stringify(
          parkPins.map((p) => [
            p.coordinates && p.coordinates.latitude,
            p.coordinates && p.coordinates.longitude,
          ])
        )}
    </div>
  );
};
