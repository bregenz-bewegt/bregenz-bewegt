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
import './profile.scss';

export const Profile: React.FC = inject(userStore.storeKey)(
  observer(() => {
    const history = useHistory();

    const handleLogout = () => {
      userStore.logout().then(() => {
        history.push('/login');
      });
    };

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Profile</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonButton onClick={() => handleLogout()}>Logout</IonButton>
        </IonContent>
      </IonPage>
    );
  })
);
