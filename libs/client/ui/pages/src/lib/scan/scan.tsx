import './scan.scss';
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { ExploreContainer } from '@bregenz-bewegt/client-ui-components';
import { scan } from 'ionicons/icons';

export const Scan: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Scan</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Scan</IonTitle>
          </IonToolbar>
        </IonHeader>
        {/* <IonFab vertical="bottom" horizontal="center" slot="fixed" edge>
          <IonFabButton>
            <IonIcon icon={scan} />
          </IonFabButton>
        </IonFab> */}
        <ExploreContainer name="Scan" />
      </IonContent>
    </IonPage>
  );
};
