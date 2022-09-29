import { IonPage, IonContent, IonSlide, IonSlides } from '@ionic/react';
import './onboarding.scss';

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
          <IonSlide>
            <h1>Slide 1</h1>
          </IonSlide>
          <IonSlide>
            <h1>Slide 2</h1>
          </IonSlide>
          <IonSlide>
            <h1>Slide 3</h1>
          </IonSlide>
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};
