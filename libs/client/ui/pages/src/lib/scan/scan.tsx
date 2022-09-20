import './scan.scss';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
  useIonViewDidLeave,
  useIonViewWillLeave,
} from '@ionic/react';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner';
import { QrReader } from 'react-qr-reader';
import { CSSProperties, useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

export const Scan: React.FC = () => {
  const router = useIonRouter();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isNative, setIsNative] = useState<boolean>();

  const openNativeScanner = async () => {
    const data = await BarcodeScanner.scan();
    setScanResult(data.text ?? 'test');
  };

  useEffect(() => {
    const isNativePlatform = Capacitor.isNativePlatform();
    setIsNative(isNativePlatform);

    if (isNativePlatform) {
      openNativeScanner();
    }
  }, []);

  useEffect(() => {
    let url;

    try {
      url = new URL(scanResult ?? '');
    } catch (error) {
      return setScanResult(null);
    }

    url && router.push(url.pathname);
  }, [scanResult]);

  useIonViewDidLeave(() => {
    setScanResult(null);
  });

  console.log(scanResult);

  return (
    <IonPage className="scan">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Scan</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <QrReader
          className="web-scanner"
          constraints={{}}
          onResult={(result, error) => {
            if (error) return;
            const text = result?.getText() ?? '';
            if (error || !text) return;
            setScanResult(text);
          }}
          videoContainerStyle={
            { paddingTop: 0, height: '100%', display: 'flex' } as CSSProperties
          }
          videoStyle={
            {
              width: 'auto',
              objectFit: 'cover',
              position: 'initial',
            } as CSSProperties
          }
        />
      </IonContent>
    </IonPage>
  );
};
