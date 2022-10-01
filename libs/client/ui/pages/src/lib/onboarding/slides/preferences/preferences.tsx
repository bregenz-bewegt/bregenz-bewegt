import { QuickFilter } from '@bregenz-bewegt/client-ui-components';
import {
  OnboardingStore,
  onboardingStore,
} from '@bregenz-bewegt/client/common/stores';
import {
  IonButton,
  IonCol,
  IonGrid,
  IonRow,
  IonSlide,
  IonText,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import './preferences.scss';

export interface PreferencesProps {
  onboardingStore?: OnboardingStore;
}

export const Preferences: React.FC<PreferencesProps> = inject(
  onboardingStore.storeKey
)(
  observer(({ onboardingStore }) => {
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
                options={onboardingStore?.preferences ?? []}
                onChange={(value) => onboardingStore?.setPreferences(value)}
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
  })
);
