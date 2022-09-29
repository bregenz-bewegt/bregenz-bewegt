import { IonPage, IonContent, IonSlides } from '@ionic/react';
import './onboarding.scss';
import { Earn, Intro, Preferences, Rewards } from './slides';

/* eslint-disable-next-line */
export interface IntroProps {}

export const Onboarding: React.FC = (props: IntroProps) => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonSlides
          pager={true}
          options={{
            initialSlide: 0,
            speed: 400,
          }}
        >
          <Intro />
          <Earn />
          <Rewards />
          <Preferences />
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};
