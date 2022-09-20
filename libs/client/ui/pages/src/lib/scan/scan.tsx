import './scan.scss';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner';
import { QrReader } from 'react-qr-reader';
import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

export const Scan: React.FC = () => {
  const [qrResult, setQrResult] = useState<string>('');
  const [isNative, setIsNative] = useState<boolean>();

  const openNativeScanner = async () => {
    const data = await BarcodeScanner.scan();
    setQrResult(data.text ?? 'test');
  };

  useEffect(() => {
    const isNativePlatform = Capacitor.isNativePlatform();
    setIsNative(isNativePlatform);

    if (isNativePlatform) {
      openNativeScanner();
    }
  }, []);

  return (
    <IonPage className="scan">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Scan</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <QrReader
          className="scan__web-scanner"
          constraints={{}}
          onResult={(result, error) => {
            console.log(result, error);
          }}
          videoContainerStyle={{ paddingTop: 0, height: '100%' }}
          videoStyle={{ width: 'auto' }}
        />
      </IonContent>
    </IonPage>
  );
};
