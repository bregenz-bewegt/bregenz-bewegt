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
import { useHistory } from 'react-router-dom';
import './profile.scss';

export interface ProfileProps {
  userStore?: UserStore;
}

export const Profile: React.FC<ProfileProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    const history = useHistory();

    const handleLogout = () => {
      userStore?.logout().then(() => {
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
          <IonButton onClick={() => handleLogout()}>Logout</IonButton>
        </IonContent>
      </IonPage>
    );
  })
);
