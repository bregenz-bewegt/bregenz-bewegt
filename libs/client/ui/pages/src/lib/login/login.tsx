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
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { loginSchema } from '@bregenz-bewegt/client/common/validation';

export interface LoginProps {
  userStore?: UserStore;
}

export const Login: React.FC<LoginProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isGuestLoading, setIsGuestLoading] = useState<boolean>(false);

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
            setIsLoading(false);
            history.push('/start');
          })
          .catch((error) => {
            setErrors(error.response.data);
            setIsLoading(false);
          });
      },
    });

    const handleGuestLogin = () => {
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

    return (
      <IonPage className="login">
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
                  onClick={() => handleGuestLogin()}
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
              <Link className="login__content__login__forgot-password" to={'#'}>
                Passwort vergessen?
              </Link>
              <IonButton
                mode="ios"
                expand="block"
                color="primary"
                onClick={() => login.submitForm()}
                disabled={isLoading}
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
        </IonContent>
      </IonPage>
    );
  })
);
