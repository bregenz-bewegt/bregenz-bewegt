import { IonPage, IonContent } from '@ionic/react';
import './intro.scss';

/* eslint-disable-next-line */
export interface IntroProps {}

export const Intro: React.FC = (props: IntroProps) => {
  return (
    <IonPage>
      <IonContent fullscreen>Intro</IonContent>
    </IonPage>
  );
};
