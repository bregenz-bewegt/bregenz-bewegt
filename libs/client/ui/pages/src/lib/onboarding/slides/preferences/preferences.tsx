import { IonSlide } from '@ionic/react';
import './preferences.scss';

/* eslint-disable-next-line */
export interface PreferencesProps {}

export const Preferences: React.FC<PreferencesProps> = (
  props: PreferencesProps
) => {
  return (
    <IonSlide>
      <h1>Preferences</h1>
    </IonSlide>
  );
};
