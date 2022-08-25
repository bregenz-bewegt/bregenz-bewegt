import { userStore } from '@bregenz-bewegt/client/common/stores';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import './park-detail.scss';

export const ParkDetail: React.FC = inject(userStore.storeKey)(
  observer(() => {
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
