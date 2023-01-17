import { useIonToast } from '@ionic/react';
import { Circle, Popup, useMapEvents } from 'react-leaflet';
import { closeCircleOutline, close } from 'ionicons/icons';
import { LocationEvent } from 'leaflet';

export interface LocationMarkerProps {
  location?: LocationEvent;
  setLocation: React.Dispatch<React.SetStateAction<LocationEvent | undefined>>;
}

export const LocationMarker: React.FC<LocationMarkerProps> = ({
  location,
  setLocation,
}) => {
  const [presentToast] = useIonToast();
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
};
