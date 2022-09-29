import { IonSlide } from '@ionic/react';
import './intro.scss';

/* eslint-disable-next-line */
export interface IntroProps {}

export const Intro: React.FC<IntroProps> = (props: IntroProps) => {
  return (
    <IonSlide>
      <h1>Intro</h1>
    </IonSlide>
  );
};
