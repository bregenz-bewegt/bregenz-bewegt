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
  useIonAlert,
  useIonLoading,
  useIonToast,
  useIonViewDidLeave,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { checkmark } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useFormik } from 'formik';
import { closeCircleOutline } from 'ionicons/icons';

export interface ProfileProps {
  userStore?: UserStore;
}

export const Profile: React.FC<ProfileProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    const history = useHistory();
    const [presentToast] = useIonToast();
    const [presentAlert] = useIonAlert();
    const [presentLoading, dismissLoading] = useIonLoading();
    const [presentActionSheet, dismissActionSheet] = useIonActionSheet();
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
    const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
    const profile = useFormik({
      initialValues: {
        firstname: userStore?.user?.firstname ?? '',
        lastname: userStore?.user?.lastname ?? '',
      },
      onSubmit: (values, { setSubmitting, setValues }) => {
        setSubmitting(true);
        userStore
          ?.patchProfile(values)
          .then((result) => {
            setValues({
              firstname: result.firstname ?? '',
              lastname: result.lastname ?? '',
            });

            setSubmitting(false);
            presentToast({
              message: 'Änderungen gespeichert',
              icon: checkmark,
              duration: 2000,
              position: 'top',
              mode: 'ios',
              color: 'success',
            });
          })
          .catch(() => {
            setSubmitting(false);
            presentToast({
              message: 'Etwas ist schiefgelaufen',
              icon: closeCircleOutline,
              duration: 2000,
              position: 'top',
              mode: 'ios',
              color: 'danger',
            });
          });
      },
    });
    const handleChangePassword = () => {
      userStore
        ?.forgotPassword()
        .then(() => {
          presentAlert({
            header: 'Passwort zurücksetzen',
            message: `Eine Email zum Zurücksetzen deines Passworts wurde an ${userStore.user?.email} versandt`,
            backdropDismiss: false,
            buttons: [{ text: 'OK' }],
          });
        })
        .catch(() => {
          presentToast({
            message: 'Etwas ist schiefgelaufen',
            icon: closeCircleOutline,
            duration: 2000,
            position: 'top',
            mode: 'ios',
            color: 'danger',
          });
        });
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
        presentLoading({
          message: 'Ändere Profilbild',
          spinner: 'crescent',
        });
        userStore
          ?.editProfilePicture(file)
          .then(() =>
            userStore.fetchProfilePicture().then(() => dismissLoading())
          )
          .catch(() => {
            dismissLoading();
            presentToast({
              message: 'Etwas ist schiefgelaufen',
              icon: closeCircleOutline,
              duration: 2000,
              position: 'top',
              mode: 'ios',
              color: 'danger',
            });
          });
      } catch (error) {
        return;
      }
    };

    const handleLogout = () => {
      setIsLoggingOut(true);
      userStore?.logout().then(() => {
        history.push('/login');
        setIsLoggingOut(false);
      });
    };

    useIonViewDidLeave(() => {
      profile.resetForm();
    });

    useEffect(() => {
      setIsImageLoaded(false);
      profile.resetForm({
        values: {
          firstname: userStore?.user?.firstname ?? '',
          lastname: userStore?.user?.lastname ?? '',
        },
      });
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
                  presentActionSheet({
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
                        handler: () => dismissActionSheet(),
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
              <Input
                name="firstname"
                placeholder="Vorname"
                label="Vorname"
                value={profile.values.firstname}
                error={
                  profile.touched.firstname
                    ? profile.errors.firstname
                    : undefined
                }
                onChange={profile.handleChange}
                onBlur={profile.handleBlur}
                disabled={!isImageLoaded}
              />
            </IonRow>
            <IonRow>
              <Input
                name="lastname"
                placeholder="Nachname"
                label="Nachname"
                value={profile.values.lastname}
                error={
                  profile.touched.lastname ? profile.errors.lastname : undefined
                }
                onChange={profile.handleChange}
                onBlur={profile.handleBlur}
                disabled={!isImageLoaded}
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
            disabled={!profile.dirty || profile.isSubmitting}
            onClick={() => profile.submitForm()}
            expand="block"
            mode="ios"
          >
            {profile.isSubmitting ? (
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
