import { ItemGroup } from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/react';
import { useState } from 'react';
import './appearance.scss';

/* eslint-disable-next-line */
export interface AppearanceProps {}

export const Appearance = (props: AppearanceProps) => {
  const [darkmodeEnabled, setDarkmodeEnabled] = useState<boolean>(false);

  return (
    <IonPage className="appearance">
      <IonHeader>
        <IonToolbar>
          <IonButtons>
            <IonBackButton
              color="primary"
              defaultHref={tabRoutes.profile.route}
              text="Zurück"
            />
          </IonButtons>
          <IonTitle>Aussehen</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <ItemGroup>
          <IonItem lines="none">
            <IonLabel>Farbthema</IonLabel>
            <IonToggle
              slot="end"
              checked={darkmodeEnabled}
              onIonChange={(e) => setDarkmodeEnabled(e.detail.checked)}
            ></IonToggle>
          </IonItem>
        </ItemGroup>
      </IonContent>
    </IonPage>
  );
};
