import './scan.scss';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
  useIonViewDidLeave,
  useIonViewWillEnter,
} from '@ionic/react';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner';
import { QrReader } from 'react-qr-reader';
import { CSSProperties, useState } from 'react';
import { Capacitor } from '@capacitor/core';

export const Scan: React.FC = () => {
  const router = useIonRouter();
  const [, setScanResult] = useState<string | null>(null);
  const [showWebScanner, setShowWebScanner] = useState<boolean>();

  const openNativeScanner = async () => {
    const data = await BarcodeScanner.scan();
    setScanResult(data.text ?? 'test');
  };

  useIonViewWillEnter(() => {
    const isNativePlatform = Capacitor.isNativePlatform();
    setShowWebScanner(!isNativePlatform);

    if (isNativePlatform) {
      openNativeScanner();
    } else {
      setShowWebScanner(true);
    }
  });

  useIonViewDidLeave(() => {
    setScanResult(null);
    setShowWebScanner(false);
  });

  return (
    <IonPage className="scan">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Scan</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {showWebScanner && (
          <>
            <QrReader
              className="web-scanner"
              constraints={{ facingMode: 'environment' }}
              onResult={(result, error) => {
                try {
                  if (error) return;
                  const text = result?.getText() ?? '';
                  if (!text) return;
                  const url = new URL(text ?? '');
                  if (!url) return setScanResult(null);

                  setScanResult(url.pathname);
                  router.push(url.pathname);
                } catch (error) {
                  setScanResult(null);
                }
              }}
              videoContainerStyle={
                {
                  paddingTop: 0,
                  height: '100%',
                  display: 'flex',
                } as CSSProperties
              }
              videoStyle={
                {
                  width: 'auto',
                  objectFit: 'cover',
                  position: 'initial',
                } as CSSProperties
              }
            />
            <div className="scan__indicator">
              <div className="scan__indicator__bar"></div>
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};
