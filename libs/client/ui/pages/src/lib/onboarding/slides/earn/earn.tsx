import { TitleBanner } from '@bregenz-bewegt/client-ui-components';
import { IonCol, IonGrid, IonRow, IonSlide } from '@ionic/react';
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
          <IonCol></IonCol>
        </IonRow>
      </IonGrid>
    </IonSlide>
  );
};
