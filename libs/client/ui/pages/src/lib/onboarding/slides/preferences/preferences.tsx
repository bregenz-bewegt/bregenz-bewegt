import {
  QuickFilter,
  QuickFilterOption,
} from '@bregenz-bewegt/client-ui-components';
import {
  OnboardingStore,
  onboardingStore,
} from '@bregenz-bewegt/client/common/stores';
import { difficultyDisplayTexts } from '@bregenz-bewegt/client/ui/shared/content';
import {
  IonButton,
  IonCol,
  IonGrid,
  IonRow,
  IonSlide,
  IonText,
} from '@ionic/react';
import { DifficultyType } from '@prisma/client';
import { inject, observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import './preferences.scss';

export interface PreferencesProps {
  onboardingStore?: OnboardingStore;
}

export const Preferences: React.FC<PreferencesProps> = inject(
  onboardingStore.storeKey
)(
  observer(({ onboardingStore }) => {
    const [selectedPreferences, setSelectedPreferences] = useState<
      QuickFilterOption[]
    >(
      Object.values(DifficultyType).map(
        (d) =>
          ({
            key: d,
            label: difficultyDisplayTexts[d],
            active: false,
          } as QuickFilterOption)
      )
    );

    useEffect(() => {
      onboardingStore?.getPreferences((p) => p && setSelectedPreferences(p));
    }, []);

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
                onChange={(value) => setSelectedPreferences(value)}
                className="preferences__quick-filter"
                iconSize={32}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                expand="block"
                href={'/login'}
                mode="ios"
                onClick={(e) => {
                  onboardingStore?.setPreferences(selectedPreferences);
                }}
                disabled={selectedPreferences.every((p) => !p.active)}
              >
                Speichern und Starten
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonSlide>
    );
  })
);
