import { TitleBanner } from '@bregenz-bewegt/client-ui-components';
import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonSlide,
} from '@ionic/react';
import { arrowForward } from 'ionicons/icons';
import './intro.scss';

/* eslint-disable-next-line */
export interface IntroProps {}

export const Intro: React.FC<IntroProps> = (props: IntroProps) => {
  return (
    <IonSlide>
      <IonGrid>
        <IonRow>
          <IonCol>
            <TitleBanner />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonButton fill="clear">
              Weiter
              <IonIcon slot="end" icon={arrowForward} />
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonSlide>
  );
};
