import './login.scss';
import { Input, TitleBanner } from '@bregenz-bewegt/client-ui-components';
import { UserStore, userStore } from '@bregenz-bewegt/client/common/stores';
import {
  IonPage,
  IonContent,
  IonText,
  IonButton,
  IonLabel,
  IonSpinner,
  IonRow,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { loginSchema } from '@bregenz-bewegt/client/common/validation';
import { VerifyEmail } from '@bregenz-bewegt/client-ui-pages';
import { loginError } from '@bregenz-bewegt/shared/errors';
import { ForgotPasswordDto } from '@bregenz-bewegt/shared/types';
import fingerprint from '@fingerprintjs/fingerprintjs';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';

export interface LoginProps {
  userStore?: UserStore;
}

export const Login: React.FC<LoginProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    const [isGuestLoading, setIsGuestLoading] = useState<boolean>(false);
    const verifyModal = useRef<HTMLIonModalElement>(null);
    const page = useRef(null);
    const [verifyModalPresentingElement, setVerifyModalPresentingElement] =
      useState<HTMLElement | null>(null);
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);

    const login = useFormik({
      initialValues: {
        email: '',
        password: '',
      },
      validationSchema: loginSchema,
      onSubmit: (values, { setSubmitting, setErrors }) => {
        userStore
          ?.login({ ...values })
          .then(() => {
            userStore.setIsLoggedIn(true);
            userStore.refreshProfile();
            setSubmitting(false);
            window.location.replace(tabRoutes.start.route);
          })
          .catch((error) => {
            if (
              error.response.data.email === loginError.EMAIL_NOT_VERIFIED.email
            ) {
              setIsVerifyModalOpen(true);
            } else {
              setErrors(error.response.data);
            }
            setSubmitting(false);
          });
      },
    });

    const handleGuestLogin = async () => {
      setIsGuestLoading(true);
      const agent = await fingerprint.load();
      const { visitorId } = await agent.get();

      userStore
        ?.guest({ visitorId })
        .then(() => {
          userStore.setIsLoggedIn(true);
          userStore.refreshProfile();
          setIsGuestLoading(false);
          window.location.replace(tabRoutes.start.route);
        })
        .catch(() => {
          setIsGuestLoading(false);
        });
    };

    const handleVerifySuccess = async () => {
      await verifyModal.current?.dismiss();
      setIsVerifyModalOpen(false);
    };

    useEffect(() => {
      setVerifyModalPresentingElement(page.current);
    }, []);

    return (
      <IonPage className="login" ref={page}>
        <IonContent className="login__content" fullscreen scrollY={false}>
          <div className="login__flex-wrapper">
            <TitleBanner />
            <div className="login__content__login">
              <IonText>
                <h2>Anmelden</h2>
              </IonText>
              <IonRow className="login__content__login__socials">
                <IonButton
                  mode="ios"
                  color="primary"
                  fill="outline"
                  className="login__content__login__socials__guest"
                  onClick={handleGuestLogin}
                >
                  {isGuestLoading ? (
                    <IonLabel>
                      <IonSpinner name="crescent" />
                    </IonLabel>
                  ) : (
                    'Als Gast beitreten'
                  )}
                </IonButton>
              </IonRow>
              <Input
                name="email"
                type="email"
                inputMode="email"
                placeholder="E-Mail"
                value={login.values.email}
                autocomplete="email"
                error={login.touched.email ? login.errors.email : undefined}
                onChange={login.handleChange}
                onBlur={login.handleBlur}
              ></Input>
              <Input
                name="password"
                type="password"
                inputMode="text"
                placeholder="Passwort"
                value={login.values.password}
                autocomplete="current-password"
                error={
                  login.touched.password ? login.errors.password : undefined
                }
                onChange={login.handleChange}
                onBlur={login.handleBlur}
              />
              <Link
                className="login__content__login__forgot-password"
                to={{
                  pathname: '/forgot-password',
                  state: {
                    email: login.values.email,
                  } as ForgotPasswordDto,
                }}
              >
                Passwort vergessen?
              </Link>
              <IonButton
                mode="ios"
                expand="block"
                color="primary"
                onClick={() => login.submitForm()}
                disabled={login.isSubmitting}
              >
                {login.isSubmitting ? (
                  <IonLabel>
                    <IonSpinner name="crescent" />
                  </IonLabel>
                ) : (
                  'Anmelden'
                )}
              </IonButton>
              <IonButton
                mode="ios"
                expand="block"
                color="primary"
                fill="outline"
                routerLink="/register"
              >
                Registrieren
              </IonButton>
            </div>
          </div>
          <VerifyEmail
            email={login.values.email}
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
            modalDismiss={() => {
              verifyModal.current?.dismiss();
              setIsVerifyModalOpen(false);
            }}
          />
        </IonContent>
      </IonPage>
    );
  })
);
