import { Input } from '@bregenz-bewegt/client-ui-components';
import { UserStore, userStore } from '@bregenz-bewegt/client/common/stores';
import { LoginCredentials } from '@bregenz-bewegt/client/types';
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
import './login.scss';

/* eslint-disable-next-line */
export interface LoginProps {
  userStore?: UserStore;
}

export const Login: React.FC<LoginProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    const history = useHistory();
    const [credentials, setCredentials] = useState<{
      [K in keyof LoginCredentials]: {
        value: LoginCredentials[K];
        error: LoginCredentials[K];
      };
    }>({
      email: { value: '', error: '' },
      password: { value: '', error: '' },
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLogin = (
      e: React.MouseEvent<HTMLIonButtonElement, MouseEvent>
    ) => {
      if (!credentials.email || !credentials.password) return;
      setIsLoading(true);

      userStore
        ?.login(credentials.email.value, credentials.password.value)
        .then(() => {
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
              <Input
                value={credentials.email.value}
                error={credentials.email.error}
                type="email"
                inputMode="email"
                placeholder="Email"
                name="email"
                required
                onIonChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    email: {
                      value: e.detail.value ?? prev?.email.value,
                      error: prev.email.error,
                    },
                  }))
                }
              ></Input>
              <Input
                value={credentials.password.value}
                error={credentials.password.error}
                type="password"
                inputMode="text"
                placeholder="Passwort"
                name="password"
                required
                onIonChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    password: {
                      value: e.detail.value ?? prev?.password.value,
                      error: prev.password.error,
                    },
                  }))
                }
              />
              <Link className="login__content__login__forgot-password" to={'#'}>
                Passwort vergessen?
              </Link>
              <IonButton
                mode="ios"
                expand="block"
                color="primary"
                onClick={(e) => handleLogin(e)}
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
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  })
);
