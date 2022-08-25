import {
  ParkStore,
  parkStore,
  UserStore,
  userStore,
} from '@bregenz-bewegt/client/common/stores';
import { Park } from '@bregenz-bewegt/client/types';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Loading } from '../loading/loading';
import './park-detail.scss';

interface MatchParams {
  id: string;
}

export interface ParkDetail extends RouteComponentProps<MatchParams> {
  userStore?: UserStore;
  parkStore?: ParkStore;
}

export const ParkDetail: React.FC<ParkDetail> = inject(
  userStore.storeKey,
  parkStore.storeKey
)(
  observer(({ userStore, match }) => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [park, setPark] = useState<Park>();
    const [exercises, setExercises] = useState<any[]>();

    useEffect(() => {
      parkStore.getPark(+match.params.id).then((park) => {
        setPark(park);
        setIsLoading(false);
      });
    }, []);

    return isLoading ? (
      <Loading />
    ) : (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Park Detail</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonButton>Park Detail</IonButton>
        </IonContent>
      </IonPage>
    );
  })
);
