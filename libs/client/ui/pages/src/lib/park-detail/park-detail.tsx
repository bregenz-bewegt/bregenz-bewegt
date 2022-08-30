import { Header } from '@bregenz-bewegt/client-ui-components';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import {
  ParkStore,
  parkStore,
  UserStore,
  userStore,
} from '@bregenz-bewegt/client/common/stores';
import { Park } from '@bregenz-bewegt/client/types';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonText,
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
    }, [match.params]);

    return isLoading ? (
      <Loading />
    ) : (
      <IonPage>
        <Header />
        <IonContent fullscreen>
          <IonText>
            <h1>{park?.name}</h1>
          </IonText>
          <IonBackButton defaultHref={tabRoutes.start.route} text="Zurück" />
        </IonContent>
      </IonPage>
    );
  })
);
