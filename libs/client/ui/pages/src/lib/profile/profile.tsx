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
  IonSkeletonText,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  useIonActionSheet,
  useIonLoading,
  useIonToast,
  useIonViewDidLeave,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { checkmark } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export interface ProfileProps {
  userStore?: UserStore;
}

export const Profile: React.FC<ProfileProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    const history = useHistory();
    const [toastPresent] = useIonToast();
    const [loadingPresent, loadingDismiss] = useIonLoading();
    const [actionSheetPresent, actionSheetDismiss] = useIonActionSheet();
    const [isSavingChanges, setIsSavingChanges] = useState<boolean>(false);
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
    const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
    const handleChangePassword = () => {
      //
    };

    const handleImageChange = async (source: CameraSource) => {
      try {
        const photo = await Camera.getPhoto({
          resultType: CameraResultType.Uri,
          allowEditing: true,
          source,
        });

        if (!photo.webPath) return;

        const res = await fetch(photo.webPath);
        const blob = await res.blob();
        const file = await new File([blob], `file.${photo.format}`);
        loadingPresent({
          message: 'Ändere Profilbild',
          spinner: 'crescent',
        });
        userStore
          ?.editProfilePicture(file)
          .then(() =>
            userStore.fetchProfilePicture().then(() => loadingDismiss())
          );
      } catch (error) {
        return;
      }
    };

    const handleSaveChanges = () => {
      // setIsSavingChanges(true);
      // userStore
      //   ?.patchProfile(getValues())
      //   .then((result) => {
      //     reset({ firstname: result.firstname, lastname: result.lastname });
      //     setIsSavingChanges(false);
      //     toastPresent({
      //       message: 'Änderungen gespeichert',
      //       icon: checkmark,
      //       duration: 2000,
      //       position: 'top',
      //       mode: 'ios',
      //       color: 'success',
      //     });
      //   })
      //   .catch((error) => setIsSavingChanges(false));
    };

    const handleLogout = () => {
      setIsLoggingOut(true);
      userStore?.logout().then(() => {
        history.push('/login');
        setIsLoggingOut(false);
      });
    };

    useIonViewDidLeave(() => {
      // reset();
    });

    useEffect(() => {
      setIsImageLoaded(false);
      // reset({
      //   firstname: userStore?.user?.firstname,
      //   lastname: userStore?.user?.lastname,
      // });
      userStore?.refreshProfile().then(() => setIsImageLoaded(true));
    }, [userStore?.user?.firstname, userStore?.user?.lastname]);

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
                <img
                  onLoad={() => setIsImageLoaded(true)}
                  src={userStore?.user?.profilePicture}
                  alt="profile"
                  style={{ display: isImageLoaded ? 'initial' : 'none' }}
                />
                {!isImageLoaded && <IonSkeletonText animated />}
              </IonAvatar>
            </IonRow>
            <IonRow className="ion-justify-content-center">
              <IonText
                className="text-center"
                color="primary"
                onClick={() =>
                  actionSheetPresent({
                    buttons: [
                      {
                        text: 'Aus Gallerie wählen',
                        handler: () => handleImageChange(CameraSource.Photos),
                      },
                      {
                        text: 'Bild Aufnehmen',
                        handler: () => handleImageChange(CameraSource.Camera),
                      },
                      {
                        text: 'Abbrechen',
                        role: 'cancel',
                        handler: () => actionSheetDismiss(),
                      },
                    ],
                    header: 'Profilbild',
                  })
                }
              >
                <p>Ändern</p>
              </IonText>
            </IonRow>
            <IonRow>
              <IonText>
                <h2>Profil</h2>
              </IonText>
            </IonRow>
            <IonRow>
              <Input label="Vorname" disabled={!isImageLoaded} />
            </IonRow>
            <IonRow>
              <Input label="Nachname" disabled={!isImageLoaded} />
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
            // disabled={!formState.isDirty || isSavingChanges}
            onClick={() => handleSaveChanges()}
            expand="block"
            mode="ios"
          >
            {isSavingChanges ? (
              <IonLabel>
                <IonSpinner name="crescent" />
              </IonLabel>
            ) : (
              'Änderungen Speichern'
            )}
          </IonButton>
          <IonButton onClick={() => handleLogout()} expand="block" mode="ios">
            {isLoggingOut ? (
              <IonLabel>
                <IonSpinner name="crescent" />
              </IonLabel>
            ) : (
              'Logout'
            )}
          </IonButton>
        </IonContent>
      </IonPage>
    );
  })
);
