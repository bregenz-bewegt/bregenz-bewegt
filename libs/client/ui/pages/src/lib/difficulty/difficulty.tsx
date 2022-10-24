import { Checkbox, ItemGroup } from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { themeStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import { DifficultyType, Preferences } from '@bregenz-bewegt/client/types';
import { difficultyDisplayTexts } from '@bregenz-bewegt/client/ui/shared/content';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { useEffect, useState } from 'react';

export interface DifficultyProps {
  userStore?: UserStore;
}

export const Difficulty = inject(themeStore.storeKey)(
  observer(({ userStore }: DifficultyProps) => {
    const [difficulties, setDifficulties] = useState<DifficultyType[]>([]);

    useEffect(() => {
      userStore
        ?.fetchPreferences()
        .then(
          (p: Preferences) => p.difficulties && setDifficulties(p.difficulties)
        );
    }, []);

    const handleSelectChange = (c: boolean, d: DifficultyType) => {
      c
        ? !difficulties.includes(d) && setDifficulties([...difficulties, d])
        : difficulties.includes(d) &&
          setDifficulties(difficulties.filter((oldD) => oldD !== d));

      userStore?.patchPreferences({ difficulties });
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
            <IonTitle>Bevorzugte Übungen</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen scrollY={false}>
          <ItemGroup>
            {Object.values(DifficultyType).map((d, i, a) => (
              <IonItem lines={i === a.length - 1 ? 'none' : 'full'}>
                <Checkbox
                  checked={difficulties.includes(d)}
                  key={i}
                  name="public-profile"
                  onChange={(e: any) => handleSelectChange(e.detail.checked, d)}
                  label={difficultyDisplayTexts[d]}
                />
              </IonItem>
            ))}
          </ItemGroup>
        </IonContent>
      </IonPage>
    );
  })
);
