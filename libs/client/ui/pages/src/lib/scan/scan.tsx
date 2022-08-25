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
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { useEffect, useState } from 'react';

export const Scan: React.FC = () => {
  const [isQrImplemented, setIsQrImplemented] = useState<boolean>(true);
  const openScanner = async () => {
    BarcodeScanner.hideBackground();
    const data = await BarcodeScanner.startScan();
    console.log(`Barcode data: ${data}`);
  };

  const checkPermission = async () => {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      console.log(status);
      if (status.granted) {
        return true;
      }
      return false;
    } catch (error) {
      setIsQrImplemented(false);
      return false;
    }
  };

  useEffect(() => {
    checkPermission();
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
