import { IonSlide, IonGrid, IonRow, IonCol, IonText } from '@ionic/react';
import './rewards.scss';

/* eslint-disable-next-line */
export interface RewardsProps {}

export const Rewards: React.FC<RewardsProps> = (props: RewardsProps) => {
  return (
    <IonSlide className="rewards">
      <IonGrid>
        <IonRow>
          <IonCol></IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonText>
              <h2>Belohnungen verdienen</h2>
            </IonText>
            <IonText>
              <p>Tausche Bregenz bewegt Coins gegen tolle Belohnungen ein.</p>
            </IonText>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonSlide>
  );
};
