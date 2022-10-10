import { IonContent, IonPage } from '@ionic/react';
import './appearance.scss';

/* eslint-disable-next-line */
export interface AppearanceProps {}

export const Appearance = (props: AppearanceProps) => {
  return (
    <IonPage className="appearance">
      <IonContent fullscreen>Appearance</IonContent>
    </IonPage>
  );
};
