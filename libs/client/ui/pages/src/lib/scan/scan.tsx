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
// import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { useEffect, useState } from 'react';

export const Scan: React.FC = () => {
  const [qrResult, setQrResult] = useState<string>('');
  const openScanner = async () => {
    const data = await BarcodeScanner.scan();
    console.log(`Barcode data: ${data}`);
    setQrResult(data.text ?? 'test');
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
        <IonRow>{qrResult}</IonRow>
        <IonButton onClick={() => openScanner()}>Scan</IonButton>
      </IonContent>
    </IonPage>
  );
};
