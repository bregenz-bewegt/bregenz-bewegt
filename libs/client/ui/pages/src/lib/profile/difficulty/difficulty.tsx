import { Checkbox, ItemGroup } from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { userStore } from '@bregenz-bewegt/client/common/stores';
import { UserStore } from '@bregenz-bewegt/client/common/stores';
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
  useIonToast,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { closeCircleOutline } from 'ionicons/icons';

export interface DifficultyProps {
  userStore?: UserStore;
}

export const Difficulty = inject(userStore.storeKey)(
  observer(({ userStore }: DifficultyProps) => {
    const [presentToast] = useIonToast();
    const [difficulties, setDifficulties] = useState<DifficultyType[]>([]);

    useEffect(() => {
      userStore
        ?.fetchPreferences()
        .then((p) => p.difficulties && setDifficulties(p.difficulties));
    }, []);

    const handleSelectChange = (
      difficulty: DifficultyType,
      selected: boolean
    ) => {
      let tempDifficulties = difficulties;

      selected
        ? !tempDifficulties.includes(difficulty) &&
          tempDifficulties.push(difficulty)
        : tempDifficulties.includes(difficulty) &&
          (tempDifficulties = tempDifficulties.filter(
            (oldD) => oldD !== difficulty
          ));

      setDifficulties(tempDifficulties);
      userStore
        ?.patchPreferences({ difficulties: tempDifficulties })
        .catch(() => {
          presentToast({
            message: 'Etwas ist schiefgelaufen',
            icon: closeCircleOutline,
            duration: 2000,
            position: 'top',
            mode: 'ios',
            color: 'danger',
          });
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