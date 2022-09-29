import { TitleBanner } from '@bregenz-bewegt/client-ui-components';
import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonSlide,
} from '@ionic/react';
import { chevronForward } from 'ionicons/icons';
import './intro.scss';

/* eslint-disable-next-line */
export interface IntroProps {}

export const Intro: React.FC<IntroProps> = (props: IntroProps) => {
  return (
    <IonSlide className="intro">
      <IonGrid>
        <IonRow className="ion-align-items-center">
          <IonCol>
            <TitleBanner animated />
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonSlide>
  );
};
