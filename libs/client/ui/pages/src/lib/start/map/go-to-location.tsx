import { IonButton } from '@ionic/react';
import { Gps, GpsSlash } from 'iconsax-react';
import { LocationEvent } from 'leaflet';
import { useMap } from 'react-leaflet';

export interface GoToLocationProps {
  location?: LocationEvent;
}

export const GoToLocation: React.FC<GoToLocationProps> = ({ location }) => {
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
