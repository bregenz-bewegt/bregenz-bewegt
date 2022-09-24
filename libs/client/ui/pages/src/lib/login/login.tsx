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
  useIonRouter,
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

export interface LoginProps {
  userStore?: UserStore;
}

export const Login: React.FC<LoginProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    const router = useIonRouter();
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
            userStore.refreshProfile();
            setSubmitting(false);
            router.push('/start');
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
      const agent = await fingerprint.load();
      const id = await agent.get();
      console.log(id);

      setIsGuestLoading(true);
      userStore
        ?.guest()
        .then(() => {
          setIsGuestLoading(false);
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
        <IonContent className="login__content" fullscreen>
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
                placeholder="Email"
                value={login.values.email}
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
                Neu Registrieren
              </IonButton>
            </div>
          </div>
          <VerifyEmail
            email={login.values.email}
            isOpen={isVerifyModalOpen}
            modalRef={verifyModal}
            modalPresentingElement={verifyModalPresentingElement!}
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
