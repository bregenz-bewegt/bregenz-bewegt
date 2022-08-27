import { Input } from '@bregenz-bewegt/client-ui-components';
import { UserStore, userStore } from '@bregenz-bewegt/client/common/stores';
import { User } from '@bregenz-bewegt/client/types';
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
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './profile.scss';

export interface ProfileProps {
  userStore?: UserStore;
}

export const Profile: React.FC<ProfileProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    const [user, setUser] = useState<User | undefined>(userStore?.user);
    const history = useHistory();

    const handleChangePassword = () => {};

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
                <img src={user?.profilePicture} alt="profile" />
              </IonAvatar>
            </IonRow>
            <IonRow>
              <IonText>
                <h2>Profil</h2>
              </IonText>
            </IonRow>
            <IonRow>
              <Input label="Vorname" value={user?.firstname} />
            </IonRow>
            <IonRow>
              <Input label="Nachname" value={user?.lastname} />
            </IonRow>
            <IonRow>
              <Input error="test" label="Benutzername" value={user?.username} />
            </IonRow>
            <IonRow>
              <Input expand={false} label="Passwort" disabled value={'*'.repeat(11)} />
              <IonButton onClick={() => handleChangePassword()}>
                Ändern
              </IonButton>
            </IonRow>
          </IonGrid>
          <IonButton onClick={() => handleLogout()}>Logout</IonButton>
        </IonContent>
      </IonPage>
    );
  })
);
