import './profile.scss';
import { Input } from '@bregenz-bewegt/client-ui-components';
import { UserStore, userStore } from '@bregenz-bewegt/client/common/stores';
import {
  IonAvatar,
  IonButton,
  IonContent,
  IonGrid,
  IonHeader,
  IonLabel,
  IonPage,
  IonRow,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  useIonToast,
  useIonViewDidLeave,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { checkmark } from 'ionicons/icons';

export interface ProfileProps {
  userStore?: UserStore;
}

export const Profile: React.FC<ProfileProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    const history = useHistory();
    const [present] = useIonToast();
    const [isSavingChanges, setIsSavingChanges] = useState<boolean>(false);
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
      setIsSavingChanges(true);
      userStore
        ?.patchProfile(getValues())
        .then((result) => {
          reset({ firstname: result.firstname, lastname: result.lastname });
          setIsSavingChanges(false);
          present({
            message: 'Änderungen gespeichert',
            icon: checkmark,
            duration: 2000,
            position: 'top',
            mode: 'ios',
            color: 'success',
          });
        })
        .catch((error) => setIsSavingChanges(false));
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
                <img src={userStore?.user?.profilePicture} alt="profile" />
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
              <Input
                label="Benutzername"
                value={userStore?.user?.username}
                disabled
              />
            </IonRow>
            <IonRow className="profile__content__password-row">
              <Input
                className="profile__content__password-row__input"
                expand={false}
                label="Passwort"
                disabled
                value={'*'.repeat(11)}
              />
              <IonButton
                onClick={() => handleChangePassword()}
                size="small"
                mode="ios"
              >
                Ändern
              </IonButton>
            </IonRow>
          </IonGrid>
          <IonButton
            disabled={!formState.isDirty || isSavingChanges}
            onClick={() => handleSaveChanges()}
            expand="block"
            mode="ios"
          >
            {isSavingChanges ? (
              <IonLabel>
                <IonSpinner name="crescent">Anmelden</IonSpinner>
              </IonLabel>
            ) : (
              'Änderungen Speichern'
            )}
          </IonButton>
          <IonButton onClick={() => handleLogout()} expand="block" mode="ios">
            Logout
          </IonButton>
        </IonContent>
      </IonPage>
    );
  })
);
