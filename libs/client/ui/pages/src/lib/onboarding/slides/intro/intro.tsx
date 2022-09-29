import { TitleBanner } from '@bregenz-bewegt/client-ui-components';
import { IonButton, IonCol, IonGrid, IonRow, IonSlide } from '@ionic/react';
import './intro.scss';

/* eslint-disable-next-line */
export interface IntroProps {}

export const Intro: React.FC<IntroProps> = (props: IntroProps) => {
  return (
    <IonSlide className="intro">
      <IonGrid>
        <IonRow className="ion-align-items-center">
          <IonCol>{/* <img src={bregenzView} alt="Bregenz Stadt" /> */}</IonCol>
        </IonRow>
        <IonRow className="ion-align-items-center">
          <IonCol>
            <TitleBanner animated />
          </IonCol>
        </IonRow>
        <IonRow className="ion-align-items-center">
          <IonCol>
            <IonButton size="large" expand="block">
              Starten
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonSlide>
  );
};
