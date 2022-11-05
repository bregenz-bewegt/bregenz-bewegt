import { Park } from '@bregenz-bewegt/client/types';
import './map.scss';

export interface MapProps {
  parks: Park[];
}

export const Map: React.FC<MapProps> = ({ parks }: MapProps) => {
  return <div>In Entwicklung - Maps</div>;
};
