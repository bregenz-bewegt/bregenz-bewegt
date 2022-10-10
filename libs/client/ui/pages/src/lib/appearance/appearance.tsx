import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import {
  IonBackButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import './appearance.scss';

/* eslint-disable-next-line */
export interface AppearanceProps {}

export const Appearance = (props: AppearanceProps) => {
  return (
    <IonPage className="appearance">
      <IonHeader>
        <IonToolbar>
          <IonBackButton
            color="primary"
            defaultHref={tabRoutes.start.route}
            text="Zurück"
          />
          <IonTitle>Aussehen</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>Appearance</IonContent>
    </IonPage>
  );
};
