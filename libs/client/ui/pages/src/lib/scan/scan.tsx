import './scan.scss';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner';
import { useEffect, useState } from 'react';

export const Scan: React.FC = () => {
  const [isQrImplemented, setIsQrImplemented] = useState<boolean>(true);
  const openScanner = async () => {
    const data = await BarcodeScanner.scan();
    console.log(`Barcode data: ${data}`);
  };

  useEffect(() => {
    // openScanner();
  }, []);

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
        <IonRow>{isQrImplemented ? 'yes' : 'no'}</IonRow>
        {/* <ExploreContainer name="Scan" /> */}
        <IonButton onClick={() => openScanner()}>Scan</IonButton>
      </IonContent>
    </IonPage>
  );
};
