import { IonCol, IonGrid, IonRow, IonSlide, IonText } from '@ionic/react';
import './preferences.scss';

/* eslint-disable-next-line */
export interface PreferencesProps {}

export const Preferences: React.FC<PreferencesProps> = (
  props: PreferencesProps
) => {
  return (
    <IonSlide className="preferences">
      <IonGrid>
        <IonRow>
          <IonCol className="ion-align-items-end">
            <IonText>
              <h2>Präferenzen auswählen</h2>
            </IonText>
            <IonText>
              <p>Setze deine persönlichen Präferenzen</p>
            </IonText>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol></IonCol>
        </IonRow>
      </IonGrid>
    </IonSlide>
  );
};
