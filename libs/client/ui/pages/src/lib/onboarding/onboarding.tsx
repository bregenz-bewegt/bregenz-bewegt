import {
  IonPage,
  IonContent,
  IonSlides,
  IonButton,
  IonCol,
  IonIcon,
  IonRow,
} from '@ionic/react';
import './onboarding.scss';
import { Earn, Intro, Preferences, Rewards } from './slides';
import { chevronForward } from 'ionicons/icons';

/* eslint-disable-next-line */
export interface IntroProps {}

export const Onboarding: React.FC = (props: IntroProps) => {
  return (
    <IonPage className="onboarding">
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
        </IonSlides>{' '}
        <IonRow className="skip-row">
          <IonCol className="ion-justify-content-end">
            <IonButton fill="clear" size="small" href="/login">
              Überspringen
              <IonIcon slot="end" icon={chevronForward} />
            </IonButton>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};
