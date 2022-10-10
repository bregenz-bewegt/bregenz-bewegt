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
          <IonItem>
            <IonLabel>Farbthema</IonLabel>
          </IonItem>
        </ItemGroup>
      </IonContent>
    </IonPage>
  );
};
