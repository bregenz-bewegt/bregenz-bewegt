import { UserStore, userStore } from '@bregenz-bewegt/client/common/stores';
import {
  IonAvatar,
  IonButton,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './profile.scss';

export interface ProfileProps {
  userStore?: UserStore;
}

export const Profile: React.FC<ProfileProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    const history = useHistory();

    const fetchProfile = () => {
      userStore?.fetchProfile().then((data) => console.log(data));
    };

    const handleLogout = () => {
      userStore?.logout().then(() => {
        history.push('/login');
      });
    };

    useEffect(() => {
      fetchProfile();
    }, []);

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonGrid>
            <IonRow className="ion-justify-content-center">
              <IonAvatar>
                <img src="" alt="profile" />
              </IonAvatar>
            </IonRow>
          </IonGrid>
          <IonButton onClick={() => handleLogout()}>Logout</IonButton>
        </IonContent>
      </IonPage>
    );
  })
);
