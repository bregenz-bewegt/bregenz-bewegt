import { TitleBanner } from '@bregenz-bewegt/client-ui-components';
import { IonCol, IonGrid, IonRow, IonSlide, IonText } from '@ionic/react';
import './earn.scss';

/* eslint-disable-next-line */
export interface EarnProps {}

export const Earn: React.FC<EarnProps> = (props: EarnProps) => {
  return (
    <IonSlide className="intro">
      <IonGrid>
        <IonRow>
          <IonCol>
            <TitleBanner animated />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonText>
              <h2>Coins sammeln</h2>
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
