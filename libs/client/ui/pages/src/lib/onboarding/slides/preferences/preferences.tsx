import {
  QuickFilter,
  QuickFilterOption,
} from '@bregenz-bewegt/client-ui-components';
import { difficultyDisplayTexts } from '@bregenz-bewegt/client/ui/shared/content';
import {
  IonButton,
  IonCol,
  IonGrid,
  IonRow,
  IonSlide,
  IonText,
} from '@ionic/react';
import { useState } from 'react';
import './preferences.scss';

/* eslint-disable-next-line */
export interface PreferencesProps {}

export const Preferences: React.FC<PreferencesProps> = (
  props: PreferencesProps
) => {
  const [selectedPreferences, setSelectedPreferences] = useState<
    QuickFilterOption[]
  >(
    Object.values(difficultyDisplayTexts).map(
      (text, i) =>
        ({
          key: i,
          label: text,
          active: false,
        } as QuickFilterOption)
    )
  );
  return (
    <IonSlide className="preferences">
      <IonGrid>
        <IonRow className="ion-align-items-end">
          <IonCol>
            <IonText>
              <h2>Präferenzen auswählen</h2>
            </IonText>
            <IonText>
              <p>Wähle deine bevorzugten Übungskategorien</p>
            </IonText>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <QuickFilter
              options={selectedPreferences}
              onChange={(values) => setSelectedPreferences(values)}
              className="preferences__quick-filter"
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonButton expand="block" href={'/login'}>
              Speichern und Starten
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonSlide>
  );
};
