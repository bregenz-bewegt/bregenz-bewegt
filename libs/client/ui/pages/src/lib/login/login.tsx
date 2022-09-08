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
import { Formik, FormikErrors } from 'formik';
import { loginSchema } from '@bregenz-bewegt/client/common/validation';
import { LoginDto } from '@bregenz-bewegt/shared/types';

export interface LoginProps {
  userStore?: UserStore;
}

export const Login: React.FC<LoginProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isGuestLoading, setIsGuestLoading] = useState<boolean>(false);

    const handleLocalLogin = (
      credentials: LoginDto,
      setErrors: (
        errors: FormikErrors<{
          email: string;
          password: string;
        }>
      ) => void
    ) => {
      setIsLoading(true);

      userStore
        ?.login({ ...credentials })
        .then(() => {
          userStore.refreshProfile();
          setIsLoading(false);
          history.push('/start');
        })
        .catch((error) => {
          setErrors(error.response.data);
          setIsLoading(false);
        });
    };

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
              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={loginSchema}
                onSubmit={(values, { setErrors }) => {
                  handleLocalLogin(values, setErrors);
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                }) => (
                  <form>
                    <Input
                      name="email"
                      type="email"
                      inputMode="email"
                      placeholder="Email"
                      value={values.email}
                      error={touched.email ? errors.email : undefined}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    ></Input>
                    <Input
                      name="password"
                      type="password"
                      inputMode="text"
                      placeholder="Passwort"
                      value={values.password}
                      error={touched.password ? errors.password : undefined}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Link
                      className="login__content__login__forgot-password"
                      to={'#'}
                    >
                      Passwort vergessen?
                    </Link>
                    <IonButton
                      mode="ios"
                      expand="block"
                      color="primary"
                      onClick={() => handleSubmit()}
                      disabled={isLoading}
                    >
                      {isLoading ? (
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
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  })
);
