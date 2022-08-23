import { IonPage, IonContent, IonSlide, IonSlides } from '@ionic/react';
import './intro.scss';

/* eslint-disable-next-line */
export interface IntroProps {}

export const Intro: React.FC = (props: IntroProps) => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonSlides
          pager={true}
          options={{
            initialSlide: 1,
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
