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
  useIonViewDidLeave,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import './profile.scss';

export interface ProfileProps {
  userStore?: UserStore;
}

export const Profile: React.FC<ProfileProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    const history = useHistory();
    const [user, setUser] = useState<User | undefined>(userStore?.user);
    const defaultValues = {
      firstname: userStore?.user?.firstname ?? '',
      lastname: userStore?.user?.lastname ?? '',
    };
    const { control, formState, getValues, reset } = useForm({
      defaultValues,
    });

    const handleChangePassword = () => {
      //
    };

    const handleSaveChanges = () => {
      userStore
        ?.patchProfile(getValues())
        .then((result) => result)
        .catch((error) => console.log(error));
    };

    const handleLogout = () => {
      userStore?.logout().then(() => {
        history.push('/login');
      });
    };

    useIonViewDidLeave(() => {
      reset();
    });

    return (
      <IonPage className="profile">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="profile__content">
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
              <Controller
                name="firstname"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <Input
                    label="Vorname"
                    name={field.name}
                    value={field.value}
                    error={fieldState.error?.message}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                )}
              />
            </IonRow>
            <IonRow>
              <Controller
                name="lastname"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <Input
                    label="Nachname"
                    name={field.name}
                    value={field.value}
                    error={fieldState.error?.message}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                )}
              />
            </IonRow>
            <IonRow>
              <Input label="Benutzername" value={user?.username} disabled />
            </IonRow>
            <IonRow className="profile__content__password-row">
              <Input
                className="profile__content__password-row__input"
                expand={false}
                label="Passwort"
                disabled
                value={'*'.repeat(11)}
              />
              <IonButton onClick={() => handleChangePassword()} size="small">
                Ändern
              </IonButton>
            </IonRow>
          </IonGrid>
          <IonButton
            disabled={!formState.isDirty}
            onClick={() => handleSaveChanges()}
            expand="block"
          >
            Änderungen Speichern
          </IonButton>
          <IonButton onClick={() => handleLogout()} expand="block">
            Logout
          </IonButton>
        </IonContent>
      </IonPage>
    );
  })
);
