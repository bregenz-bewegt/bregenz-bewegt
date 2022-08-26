import { Input } from '@bregenz-bewegt/client-ui-components';
import { UserStore, userStore } from '@bregenz-bewegt/client/common/stores';
import {
  IonAvatar,
  IonButton,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonText,
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
          <IonGrid>
            <IonRow className="ion-justify-content-center">
              <IonAvatar>
                <img src={userStore?.user?.profilePicture} alt="profile" />
              </IonAvatar>
            </IonRow>
            <IonRow>
              <IonText>
                <h2>Profil</h2>
              </IonText>
            </IonRow>
            <IonRow>
              <Input label="Vorname" value={userStore?.user?.firstname} />
            </IonRow>
            <IonRow>
              <Input label="Nachname" value={userStore?.user?.lastname} />
            </IonRow>
            <IonRow>
              <Input label="Benutzername" value={userStore?.user?.username} />
            </IonRow>
            <IonRow>
              <Input label="Passwort" disabled value={'*'.repeat(11)} />
            </IonRow>
          </IonGrid>
          <IonButton onClick={() => handleLogout()}>Logout</IonButton>
        </IonContent>
      </IonPage>
    );
  })
);
