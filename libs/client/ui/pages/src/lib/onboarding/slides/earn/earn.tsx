import { Coin } from '@bregenz-bewegt/client-ui-components';
import { IonCol, IonGrid, IonRow, IonSlide, IonText } from '@ionic/react';
import './earn.scss';

/* eslint-disable-next-line */
export interface EarnProps {}

export const Earn: React.FC<EarnProps> = (props: EarnProps) => {
  return (
    <IonSlide className="earn">
      <IonGrid>
        <IonRow className="ion-align-items-center">
          <IonCol className="ion-justify-content-center">
            <Coin className="earn__coin" />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonText>
              <h2>B-Bucks sammeln</h2>
            </IonText>
            <IonText>
              <p>
                Absolviere Sportübungen, stoppe deine Zeit und sammle Bregenz
                bewegt Coins.
              </p>
            </IonText>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonSlide>
  );
};
