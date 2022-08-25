import { UserStore, userStore } from '@bregenz-bewegt/client/common/stores';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import './park-detail.scss';

export interface ParkDetail extends RouteComponentProps {
  userStore?: UserStore;
}

export const ParkDetail: React.FC<ParkDetail> = inject(userStore.storeKey)(
  observer(({ userStore, match }) => {
    const history = useHistory();

    return (
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
