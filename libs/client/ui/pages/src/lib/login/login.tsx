import { Input } from '@bregenz-bewegt/client-ui-components';
import { UserStore, userStore } from '@bregenz-bewegt/client/common/stores';
import { LoginCredentials } from '@bregenz-bewegt/client/types';
import {
  IonPage,
  IonContent,
  IonText,
  IonButton,
  IonInput,
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
    const [credentials, setCredentials] = useState<LoginCredentials>({
      email: '',
      password: '',
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLogin = (
      e: React.MouseEvent<HTMLIonButtonElement, MouseEvent>
    ) => {
      if (!credentials.email || !credentials.password) return;
      setIsLoading(true);

      userStore?.login(credentials.email, credentials.password).then(() => {
        setIsLoading(false);
        history.push('/start');
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
              <IonInput
                value={credentials.email}
                type="email"
                inputMode="email"
                placeholder="Email"
                name="email"
                required
                onIonChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    email: e.detail.value ?? credentials?.email,
                  }))
                }
              ></IonInput>
              <IonInput
                value={credentials.password}
                type="password"
                inputMode="text"
                placeholder="Passwort"
                name="password"
                required
                onIonChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    password: e.detail.value ?? credentials?.password,
                  }))
                }
              ></IonInput>
              <Input
                value={credentials.password}
                type="password"
                inputMode="text"
                placeholder="Passwort"
                name="password"
                required
              />
              <Link className="login__content__login__forgot-password" to={'#'}>
                Passwort vergessen?
              </Link>
              <IonButton
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
