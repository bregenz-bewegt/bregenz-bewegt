import { BackButton, ItemGroup } from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { ThemeStore, themeStore } from '@bregenz-bewegt/client/common/stores';
import { ColorTheme } from '@bregenz-bewegt/client/types';
import { themeDisplayTexts } from '@bregenz-bewegt/client/ui/shared/content';
import {
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
import { inject, observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import './appearance.scss';

export interface AppearanceProps {
  themeStore?: ThemeStore;
}

export const Appearance = inject(themeStore.storeKey)(
  observer(({ themeStore }: AppearanceProps) => {
    const [theme, setTheme] = useState<ColorTheme>();

    useEffect(() => {
      themeStore?.getTheme((value) => {
        setTheme(value);
      });
    }, []);

    useEffect(() => {
      themeStore?.setTheme(theme ?? themeStore.defaultTheme);
    }, [theme]);

    return (
      <IonPage className="appearance">
        <IonHeader mode="ios" collapse="condense" className="ion-no-border">
          <IonToolbar>
            <IonButtons>
              <BackButton defaultRouterLink={tabRoutes.profile.route} />
            </IonButtons>
            <IonTitle>Darstellung</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen scrollY={false}>
          <ItemGroup>
            <IonRadioGroup
              value={theme}
              onIonChange={(e) => setTheme(e.detail.value)}
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
  })
);
