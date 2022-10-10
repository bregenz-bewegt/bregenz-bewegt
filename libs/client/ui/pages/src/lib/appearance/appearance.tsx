import { ItemGroup } from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { ColorTheme } from '@bregenz-bewegt/client/types';
import { themeDisplayTexts } from '@bregenz-bewegt/client/ui/shared/content';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonRadio,
  IonRadioGroup,
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
          <IonRadioGroup
            value={ColorTheme.System}
            onIonChange={(e) => console.log(e)}
          >
            {Object.values(ColorTheme).map((option, i, a) => (
              <IonItem lines={i === a.length - 1 ? 'none' : 'full'}>
                <IonLabel>{themeDisplayTexts[option]}</IonLabel>
                <IonRadio slot="end" value={option}></IonRadio>
              </IonItem>
            ))}
          </IonRadioGroup>
        </ItemGroup>
      </IonContent>
    </IonPage>
  );
};
