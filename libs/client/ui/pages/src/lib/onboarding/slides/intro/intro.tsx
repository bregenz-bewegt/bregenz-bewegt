import { IonCol, IonGrid, IonRow, IonSlide } from '@ionic/react';
import './intro.scss';
import { logo } from '@bregenz-bewegt/shared/ui/assets';
import { TitleBanner } from '@bregenz-bewegt/client-ui-components';

/* eslint-disable-next-line */
export interface IntroProps {}

export const Intro: React.FC<IntroProps> = (props: IntroProps) => {
  return (
    <IonSlide className="intro">
      <IonGrid>
        <IonRow className="ion-align-items-center">
          <IonCol className="ion-justify-content-start">
            <img src={logo} alt="logo" width={200} height={200} />
            <TitleBanner animated />
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonSlide>
  );
};
