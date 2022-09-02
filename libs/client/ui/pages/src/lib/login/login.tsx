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
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import { LoginCredentials } from '@bregenz-bewegt/client/types';
import { loginSchema } from '@bregenz-bewegt/client/common/validation';

export interface LoginProps {
  userStore?: UserStore;
}

export const Login: React.FC<LoginProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLogin = (credentials: LoginCredentials) => {
      setIsLoading(true);

      userStore
        ?.login(credentials.email, credentials.password)
        .then(() => {
          userStore.refreshProfile();
          setIsLoading(false);
          history.push('/start');
        })
        .catch((error) => {
          console.log(error);
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
              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={loginSchema}
                validateOnChange
                onSubmit={(values) => {
                  console.log(values);
                  handleLogin(values);
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
                      error={errors.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    ></Input>
                    <Input
                      name="password"
                      type="password"
                      inputMode="text"
                      placeholder="Passwort"
                      value={values.password}
                      error={errors.password}
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
