import { ItemGroup, Toggle } from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { themeStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import { Preferences } from '@bregenz-bewegt/client/types';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { useEffect, useState } from 'react';

export interface PupblicProfileProps {
  userStore?: UserStore;
}

export const PublicProfile = inject(themeStore.storeKey)(
  observer(({ userStore }: PupblicProfileProps) => {
    const [publicProfile, setPublicProfile] = useState<boolean>(false);

    useEffect(() => {
      userStore
        ?.fetchPreferences()
        .then((p: Preferences) => setPublicProfile(p.public ?? false));
    }, []);

    const handlePublicChange = (c: boolean) => {
      setPublicProfile(c);
      userStore?.patchPreferences({ public: c });
    };

    return (
      <IonPage>
        <IonHeader mode="ios">
          <IonToolbar>
            <IonButtons>
              <IonBackButton
                color="primary"
                defaultHref={tabRoutes.profile.route}
                text="Zurück"
              />
            </IonButtons>
            <IonTitle>Öffnetliches Profil</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen scrollY={false}>
          <ItemGroup>
            <Toggle
              name="public-profile"
              checked={publicProfile}
              onChange={(e: any) => {
                handlePublicChange(e.currentTarget.checked);
              }}
              label="Profil öffentlich für andere unter Rangliste sichtbar machen"
            />
          </ItemGroup>
        </IonContent>
      </IonPage>
    );
  })
);
