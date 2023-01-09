import {
  BackButton,
  ItemGroup,
  Toggle,
} from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
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
import { useDefaultErrorToast } from '@bregenz-bewegt/client/common/hooks';

export interface PupblicProfileProps {
  userStore?: UserStore;
}

export const PublicProfile = inject(userStore.storeKey)(
  observer(({ userStore }: PupblicProfileProps) => {
    const [presentDefaultErrorToast] = useDefaultErrorToast();

    const [publicProfile, setPublicProfile] = useState<boolean>(false);

    useEffect(() => {
      userStore
        ?.fetchPreferences()
        .then((p: Preferences) => setPublicProfile(p.public ?? false));
    }, []);

    const handlePublicChange = (c: boolean) => {
      setPublicProfile(c);
      userStore
        ?.patchPreferences({ public: c })
        .catch(() => presentDefaultErrorToast());
    };

    return (
      <IonPage>
        <IonHeader mode="ios" collapse="fade" className="ion-no-header">
          <IonToolbar>
            {/* <IonButtons>
              <IonBackButton
                color="primary"
                defaultHref={tabRoutes.profile.route}
                text="Zurück"
              />
            </IonButtons> */}
            <BackButton defaultRouterLink={tabRoutes.profile.route} />
            <IonTitle>Öffentliches Profil</IonTitle>
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
              label="Öffentlich sichtbar in Rangliste erscheinen"
            />
          </ItemGroup>
        </IonContent>
      </IonPage>
    );
  })
);
