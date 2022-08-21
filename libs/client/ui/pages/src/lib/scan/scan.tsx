import './scan.scss';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { ExploreContainer } from '@bregenz-bewegt/client-ui-components';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

export const Scan: React.FC = () => {
  const openScanner = async () => {
    BarcodeScanner.hideBackground();
    const data = await BarcodeScanner.startScan();
    console.log(`Barcode data: ${data}`);
  };

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
        <ExploreContainer name="Scan" />
        <IonButton onClick={() => openScanner()}>Scan</IonButton>
      </IonContent>
    </IonPage>
  );
};
