import './scan.scss';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
  useIonViewDidLeave,
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

  useIonViewDidLeave(() => {
    setScanResult(null);
  });

  return (
    <IonPage className="scan">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Scan</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {!isNative && (
          <>
            <QrReader
              className="web-scanner"
              constraints={{}}
              onResult={(result, error) => {
                if (error) return;
                const text = result?.getText() ?? '';
                if (error || !text) return;

                let url;
                try {
                  url = new URL(scanResult ?? '');
                } catch (error) {
                  setScanResult(null);
                }
                if (!url) return setScanResult(null);

                setScanResult(url.pathname);
                url && router.push(url.pathname);
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
