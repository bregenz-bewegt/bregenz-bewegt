import {
  BackButton,
  Checkbox,
  ItemGroup,
} from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { userStore } from '@bregenz-bewegt/client/common/stores';
import { UserStore } from '@bregenz-bewegt/client/common/stores';
import { DifficultyType } from '@bregenz-bewegt/client/types';
import { difficultyDisplayTexts } from '@bregenz-bewegt/client/ui/shared/content';
import {
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
import { useDefaultErrorToast } from '@bregenz-bewegt/client/common/hooks';

export interface DifficultyProps {
  userStore?: UserStore;
}

export const Difficulty = inject(userStore.storeKey)(
  observer(({ userStore }: DifficultyProps) => {
    const [presentDefaultErrorToast] = useDefaultErrorToast();
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
        .catch(() => presentDefaultErrorToast());
    };

    return (
      <IonPage>
        <IonHeader mode="ios" collapse="condense" className="ion-no-border">
          <IonToolbar>
            <IonButtons>
              <BackButton defaultRouterLink={tabRoutes.profile.route} />
            </IonButtons>
            <IonTitle>Bevorzugte Übungen</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen scrollY={false}>
          <ItemGroup>
            {Object.values(DifficultyType).map((d, i, a) => (
              <IonItem lines={i === a.length - 1 ? 'none' : 'full'} key={i}>
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
