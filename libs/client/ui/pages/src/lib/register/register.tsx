import {
  Checkbox,
  Input,
  TitleBanner,
} from '@bregenz-bewegt/client-ui-components';
import { VerifyEmail } from '@bregenz-bewegt/client-ui-pages';
import {
  onboardingStore,
  OnboardingStore,
  UserStore,
  userStore,
} from '@bregenz-bewegt/client/common/stores';
import { registerSchema } from '@bregenz-bewegt/client/common/validation';
import {
  IonPage,
  IonContent,
  IonText,
  IonButton,
  IonLabel,
  IonSpinner,
  IonNote,
  IonRow,
} from '@ionic/react';
import { DifficultyType } from '@prisma/client';
import { useFormik } from 'formik';
import { inject, observer } from 'mobx-react';
import { useEffect, useRef, useState } from 'react';
import './register.scss';

export interface RegisterProps {
  userStore?: UserStore;
  onboardingStore?: OnboardingStore;
}

export const Register: React.FC<RegisterProps> = inject(
  userStore.storeKey,
  onboardingStore.storeKey
)(
  observer(({ userStore, onboardingStore }) => {
    const [acceptTos, setAcceptTos] = useState<boolean>(false);
    const [acceptTosValid, setAcceptTosValid] = useState<boolean>(true);
    const verifyModal = useRef<HTMLIonModalElement>(null);
    const page = useRef(null);
    const [verifyModalPresentingElement, setVerifyModalPresentingElement] =
      useState<HTMLElement | null>(null);
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);

    const register = useFormik({
      initialValues: {
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
      },
      validationSchema: registerSchema,
      onSubmit: (values, { setSubmitting, setErrors }) => {
        if (!acceptTos) {
          setAcceptTosValid(false);
          return setSubmitting(false);
        }

        userStore
          ?.register({
            firstname: values.firstname || undefined,
            lastname: values.lastname || undefined,
            username: values.username,
            email: values.email,
            password: values.password,
          })
          .then(() => {
            setIsVerifyModalOpen(true);
            setSubmitting(false);
          })
          .catch((error) => {
            setErrors(error.response.data);
            setSubmitting(false);
          });
      },
    });

    const handleVerifySuccess = async () => {
      onboardingStore?.getPreferences((preferences) =>
        userStore
          ?.patchPreferences({
            difficulties: preferences
              ?.filter((p) => p.active)
              .map((p) => p.key as DifficultyType),
          })
          .then(() => {
            onboardingStore?.setPreferences(null);
          })
      );
      await verifyModal.current?.dismiss();
    };

    useEffect(() => {
      setVerifyModalPresentingElement(page.current);
    }, []);

    return (
      <IonPage className="register" ref={page}>
        <IonContent className="register__content" fullscreen scrollY={false}>
          <div className="register__flex-wrapper">
            <TitleBanner />
            <div className="register__content__wrapper">
              <IonText>
                <h2>Registrieren</h2>
              </IonText>
              <IonRow className="register__content__wrapper__name-wrapper">
                <Input
                  name="firstname"
                  placeholder="Vorname"
                  value={register.values.firstname}
                  autocomplete="given-name"
                  error={
                    register.touched.firstname
                      ? register.errors.firstname
                      : undefined
                  }
                  onChange={register.handleChange}
                  onBlur={register.handleBlur}
                  className="firstname"
                  expand={false}
                />
                <Input
                  name="lastname"
                  placeholder="Nachname"
                  value={register.values.lastname}
                  autocomplete="family-name"
                  error={
                    register.touched.lastname
                      ? register.errors.lastname
                      : undefined
                  }
                  onChange={register.handleChange}
                  onBlur={register.handleBlur}
                  className="lastname"
                  expand={false}
                />
              </IonRow>
              <Input
                name="username"
                placeholder="Benutzername"
                value={register.values.username}
                autocomplete="username"
                error={
                  register.touched.username
                    ? register.errors.username
                    : undefined
                }
                onChange={register.handleChange}
                onBlur={register.handleBlur}
                className="username"
              />
              <Input
                name="email"
                placeholder="E-Mail"
                type="email"
                inputMode="email"
                value={register.values.email}
                autocomplete="email"
                error={
                  register.touched.email ? register.errors.email : undefined
                }
                onChange={register.handleChange}
                onBlur={register.handleBlur}
                className="email"
              />
              <Input
                name="password"
                placeholder="Passwort"
                type="password"
                value={register.values.password}
                autocomplete="new-password"
                error={
                  register.touched.password
                    ? register.errors.password
                    : undefined
                }
                onChange={register.handleChange}
                onBlur={register.handleBlur}
                className="password"
              />
              <Input
                name="passwordConfirmation"
                placeholder="Passwort bestätigen"
                type="password"
                value={register.values.passwordConfirmation}
                autocomplete="new-password"
                error={
                  register.touched.passwordConfirmation
                    ? register.errors.passwordConfirmation
                    : undefined
                }
                onChange={register.handleChange}
                onBlur={register.handleBlur}
                className="password-confirmation"
              />
              <Checkbox
                name="accept-tos"
                className="accept-tos"
                checked={acceptTos}
                valid={acceptTosValid}
                label={
                  <IonNote mode="md">
                    Ich akzeptiere Datenschutz und Nutzungsbedingungen
                  </IonNote>
                }
                onChange={(e: any) => {
                  setAcceptTos(e.currentTarget.checked);
                  setAcceptTosValid(true);
                }}
              />
              <IonButton
                mode="ios"
                expand="block"
                color="primary"
                onClick={() => {
                  if (!acceptTos) setAcceptTosValid(false);
                  register.submitForm();
                }}
                disabled={register.isSubmitting}
              >
                {register.isSubmitting ? (
                  <IonLabel>
                    <IonSpinner name="crescent" />
                  </IonLabel>
                ) : (
                  'Registrieren'
                )}
              </IonButton>
              <IonButton
                mode="ios"
                expand="block"
                color="primary"
                fill="outline"
                routerLink="/login"
                routerDirection="back"
              >
                Anmelden
              </IonButton>
            </div>
          </div>
          <VerifyEmail
            email={register.values.email}
            isOpen={isVerifyModalOpen}
            modalRef={verifyModal}
            modalPresentingElement={verifyModalPresentingElement!}
            onVerifySubmit={async (email, token) =>
              userStore?.verify({
                email: email,
                token: token,
              })
            }
            onVerifySuccess={handleVerifySuccess}
            modalDismiss={() => verifyModal.current?.dismiss()}
          />
        </IonContent>
      </IonPage>
    );
  })
);
