import React from 'react';
import './loading.scss';
import { IonContent, IonPage, IonSpinner, SpinnerTypes } from '@ionic/react';

export interface LoadingProps {
  spinner?: SpinnerTypes;
}

export const Loading: React.FC<LoadingProps> = ({ spinner = 'crescent' }) => {
  return (
    <IonPage className="loading">
      <IonContent fullscreen>
        <div className="loading__wrapper">
          <IonSpinner color="primary" name={spinner} />
        </div>
      </IonContent>
    </IonPage>
  );
};
