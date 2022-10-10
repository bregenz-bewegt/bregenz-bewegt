import './profile.scss';
import { Input, ItemGroup } from '@bregenz-bewegt/client-ui-components';
import { UserStore, userStore } from '@bregenz-bewegt/client/common/stores';
import {
  IonAvatar,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonSkeletonText,
  IonSpinner,
  IonText,
  IonTitle,
  IonToast,
  IonToolbar,
  useIonActionSheet,
  useIonAlert,
  useIonLoading,
  useIonRouter,
  useIonToast,
  useIonViewDidLeave,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { checkmark } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useFormik } from 'formik';
import { closeCircleOutline, lockClosed } from 'ionicons/icons';
import { trash, image, camera } from 'ionicons/icons';
import { validProfilePictureMimeTypes } from '@bregenz-bewegt/shared/constants';
import { ValidProfilePictureMimeType } from '@bregenz-bewegt/shared/types';
import { Role } from '@bregenz-bewegt/client/types';

export interface ProfileProps {
  userStore?: UserStore;
}

export const Profile: React.FC<ProfileProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    const router = useIonRouter();
    const [presentToast] = useIonToast();
    const [presentAlert] = useIonAlert();
    const [presentLoading, dismissLoading] = useIonLoading();
    const [presentActionSheet, dismissActionSheet] = useIonActionSheet();
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
    const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

    const showFailureToast = () => {
      dismissLoading();
      presentToast({
        message: 'Etwas ist schiefgelaufen',
        icon: closeCircleOutline,
        duration: 2000,
        position: 'top',
        mode: 'ios',
        color: 'danger',
      });
    };

    const showSuccessToast = () => {
      dismissLoading();
      presentToast({
        message: 'Änderungen gespeichert',
        icon: checkmark,
        duration: 2000,
        position: 'top',
        mode: 'ios',
        color: 'success',
      });
    };

    const isGuest = userStore?.user?.role === Role.GUEST;

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
            showSuccessToast();
          })
          .catch(() => {
            setSubmitting(false);
            showFailureToast();
          });
      },
    });

    const handleChangePassword = () => {
      userStore
        ?.changePassword()
        .then(() => {
          presentAlert({
            header: 'Passwort zurücksetzen',
            message: `Eine Email zum Zurücksetzen deines Passworts wurde an ${userStore.user?.email} versendet`,
            backdropDismiss: false,
            buttons: [{ text: 'OK' }],
          });
        })
        .catch(() => showFailureToast());
    };

    const handleImageChange = async (source: CameraSource) => {
      try {
        const photo = await Camera.getPhoto({
          resultType: CameraResultType.Uri,
          allowEditing: true,
          source,
        });

        if (!photo.webPath) return;

        presentLoading({
          message: 'Ändere Profilbild',
          spinner: 'crescent',
        });

        const res = await fetch(photo.webPath);
        const blob = await res.blob();
        if (
          !validProfilePictureMimeTypes.includes(
            blob.type as ValidProfilePictureMimeType
          )
        ) {
          return showFailureToast();
        }
        const file = await new File([blob], `file.${photo.format}`);
        userStore
          ?.editProfilePicture(file)
          .then(() =>
            userStore.fetchProfilePicture().then(() => {
              dismissLoading().then(() => showSuccessToast());
            })
          )
          .catch(() => {
            showFailureToast();
          });
      } catch (error) {
        showFailureToast();
      }
    };

    const handleImageRemove = () => {
      userStore
        ?.removeProfilePicture()
        .then(() => showSuccessToast())
        .catch(() => showFailureToast());
    };

    const handleLogout = (redirect: string, userRole?: Role) => {
      userRole === Role.USER
        ? setIsLoggingOut(true)
        : userStore?.setIsLoadingLoggedIn(true);
      userStore?.logout().then(() => {
        router.push(redirect);
        userRole === Role.USER
          ? setIsLoggingOut(false)
          : userStore?.setIsLoadingLoggedIn(false);
      });
    };

    const handleDelete = () => {
      presentAlert({
        header: 'Account löschen',
        message: `Der Account sowie alle zugehörigen Daten werden gelöscht. Wollen Sie fortfahren?`,
        backdropDismiss: false,
        buttons: [
          { text: 'Abbrechen', role: 'cancel' },
          {
            text: 'Ja',
            role: 'OK',
            handler: () => {
              userStore
                ?.deleteProfile()
                .then(() => {
                  handleLogout('/login', userStore?.user?.role);
                  presentToast({
                    message: 'Account gelöscht',
                    icon: checkmark,
                    duration: 2000,
                    position: 'top',
                    mode: 'ios',
                    color: 'success',
                  });
                })
                .catch(() => showFailureToast());
            },
          },
        ],
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
            <IonTitle>Profil</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent
          fullscreen
          className={`profile__content ${
            isGuest ? `profile__content__locked` : ''
          }`}
          scrollY={!isGuest}
        >
          <IonToast
            isOpen={profile.dirty}
            message="Änderungen speichern?"
            position="top"
            mode="ios"
            color="primary"
            buttons={[
              {
                icon: checkmark,
                role: 'save',
                handler: () => profile.submitForm(),
              },
            ]}
          />
          <IonGrid>
            {isGuest && (
              <div className="guest-lock-modal">
                <IonGrid>
                  <IonRow>
                    <IonIcon
                      className="lock-icon"
                      icon={lockClosed}
                      color="primary"
                    />
                  </IonRow>
                  <IonRow className="info">
                    <IonText color="primary">
                      Erstelle ein Konto, um auf dein Profil zugreifen zu
                      können.
                    </IonText>
                  </IonRow>
                  <IonRow>
                    <IonButton
                      expand="block"
                      mode="ios"
                      fill="solid"
                      onClick={() =>
                        handleLogout('/register', userStore.user?.role)
                      }
                    >
                      {isLoggingOut ? (
                        <IonLabel>
                          <IonSpinner name="crescent" />
                        </IonLabel>
                      ) : (
                        'Konto erstellen'
                      )}
                    </IonButton>
                  </IonRow>
                </IonGrid>
              </div>
            )}
            <div className={isGuest ? 'guest-lock' : ''}>
              <IonRow className="ion-justify-content-center">
                <IonText className="profile__content__username">
                  <h1>{userStore?.user?.username}</h1>
                </IonText>
              </IonRow>
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
                          icon: image,
                        },
                        {
                          text: 'Bild aufnehmen',
                          handler: () => handleImageChange(CameraSource.Camera),
                          icon: camera,
                        },
                        ...(userStore?.isProfilePictureSet
                          ? [
                              {
                                text: 'Bild entfernen',
                                handler: () => handleImageRemove(),
                                icon: trash,
                                role: 'destructive',
                              },
                            ]
                          : []),
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
                    profile.touched.lastname
                      ? profile.errors.lastname
                      : undefined
                  }
                  onChange={profile.handleChange}
                  onBlur={profile.handleBlur}
                  disabled={!isImageLoaded}
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
              <ItemGroup>
                <IonItem button>
                  <IonLabel>Aussehen</IonLabel>
                </IonItem>
                <IonItem button>
                  <IonLabel>Test</IonLabel>
                </IonItem>
              </ItemGroup>
            </div>
          </IonGrid>
          {!isGuest && (
            <IonRow className="profile__content__danger-row">
              <IonCol className="delete">
                <IonButton
                  onClick={() => handleDelete()}
                  expand="block"
                  mode="ios"
                  color="danger"
                >
                  Konto Löschen
                </IonButton>
              </IonCol>
              <IonCol className="logout">
                <IonButton
                  onClick={() => handleLogout('/login', userStore?.user?.role)}
                  expand="block"
                  mode="ios"
                >
                  {isLoggingOut ? (
                    <IonLabel>
                      <IonSpinner name="crescent" />
                    </IonLabel>
                  ) : (
                    'Abmelden'
                  )}
                </IonButton>
              </IonCol>
            </IonRow>
          )}
        </IonContent>
      </IonPage>
    );
  })
);
