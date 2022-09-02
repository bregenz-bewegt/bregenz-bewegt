import './login.scss';
import { Input } from '@bregenz-bewegt/client-ui-components';
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
import { LoginCredentials } from '@bregenz-bewegt/client/types';

export interface LoginProps {
  userStore?: UserStore;
}

export const Login: React.FC<LoginProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLogin = (
      credentials: LoginCredentials,
      setErrors: (
        errors: FormikErrors<{
          email: string;
          password: string;
        }>
      ) => void
    ) => {
      setIsLoading(true);

      userStore
        ?.login(credentials.email, credentials.password)
        .then(() => {
          userStore.refreshProfile();
          setIsLoading(false);
          history.push('/start');
        })
        .catch((error) => {
          console.log(error.response.data);
          setErrors(error.response.data);
          setIsLoading(false);
        });
    };

    return (
      <IonPage className="login">
        <IonContent className="login__content" fullscreen>
          <div className="login__flex-wrapper">
            <IonText className="login__content__title">
              <h1>
                Bregenz
                <br />
                Bewegt
              </h1>
            </IonText>
            <div className="login__content__login">
              <IonText>
                <h2>Anmelden</h2>
              </IonText>
              <IonRow className="login__content__login__socials">
                <IonButton
                  mode="ios"
                  color="primary"
                  fill="outline"
                  size="small"
                >
                  Als Gast beitreten
                </IonButton>
              </IonRow>
              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={loginSchema}
                validateOnChange
                onSubmit={(values, { setErrors }) => {
                  console.log(values);
                  handleLogin(values, setErrors);
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
                          <IonSpinner name="crescent">Anmelden</IonSpinner>
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
