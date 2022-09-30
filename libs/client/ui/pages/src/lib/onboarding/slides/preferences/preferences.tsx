import {
  IonButton,
  IonCol,
  IonGrid,
  IonRow,
  IonSlide,
  IonText,
} from '@ionic/react';
import './preferences.scss';

/* eslint-disable-next-line */
export interface PreferencesProps {}

export const Preferences: React.FC<PreferencesProps> = (
  props: PreferencesProps
) => {
  return (
    <IonSlide className="preferences">
      <IonGrid>
        <IonRow className="ion-align-items-end">
          <IonCol>
            <IonText>
              <h2>Präferenzen auswählen</h2>
            </IonText>
            <IonText>
              <p>Setze deine persönlichen Präferenzen</p>
            </IonText>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonButton expand="block">Speichern und Starten</IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonSlide>
  );
};
