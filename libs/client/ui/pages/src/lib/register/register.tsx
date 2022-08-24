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
import { Link } from 'react-router-dom';
import './register.scss';

/* eslint-disable-next-line */
export interface RegisterProps {
  userStore?: UserStore;
}

export const Register: React.FC<RegisterProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    const [credentials, setCredentials] = useState<LoginCredentials>({
      email: '',
      password: '',
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleRegister = (
      e: React.MouseEvent<HTMLIonButtonElement, MouseEvent>
    ) => {};

    return (
      <IonPage className="register">
        <IonContent className="register__content" fullscreen>
          <div className="register__flex-wrapper">
            <IonText className="register__content__title">
              <h1>
                Bregenz
                <br />
                Bewegt
              </h1>
            </IonText>
            <div className="register__content__login">
              <IonText>
                <h2>Registrieren</h2>
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
              <Link className="login__content__login__forgot-password" to={'#'}>
                Passwort vergessen?
              </Link>
              <IonButton
                expand="block"
                color="primary"
                onClick={(e) => handleRegister(e)}
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
                href="/register"
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
