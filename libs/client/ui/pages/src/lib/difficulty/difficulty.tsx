import { Checkbox, ItemGroup } from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import { DifficultyType } from '@bregenz-bewegt/client/types';
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

export const Difficulty = inject(userStore.storeKey)(
  observer(({ userStore }: DifficultyProps) => {
    const [difficulties, setDifficulties] = useState<DifficultyType[]>([]);

    useEffect(() => {
      userStore
        ?.fetchPreferences()
        .then((p) => p.difficulties && setDifficulties(p.difficulties));
    }, []);

    console.log(difficulties);

    const handleSelectChange = (
      difficulty: DifficultyType,
      selected: boolean
    ) => {
      let tempDifficulties: DifficultyType[] = difficulties;

      selected
        ? !tempDifficulties.includes(difficulty) &&
          (tempDifficulties = [...tempDifficulties, difficulty])
        : tempDifficulties.includes(difficulty) &&
          (tempDifficulties = difficulties.filter(
            (oldD) => oldD !== difficulty
          ));

      userStore
        ?.patchPreferences({ difficulties: tempDifficulties })
        .then((data) => {
          console.log(data);
        })
        .catch((e) => {
          console.log(e);
        });
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
                  onChange={(e: any) => handleSelectChange(d, e.detail.checked)}
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
