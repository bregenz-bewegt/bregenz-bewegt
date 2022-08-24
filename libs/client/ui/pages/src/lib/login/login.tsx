import { LoginCredentials } from '@bregenz-bewegt/client/types';
import {
  IonPage,
  IonContent,
  IonText,
  IonButton,
  IonInput,
  IonItem,
} from '@ionic/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './login.scss';

/* eslint-disable-next-line */
export interface LoginProps {}

export const Login: React.FC = (props: LoginProps) => {
  const [credentials, setCredentials] = useState<LoginCredentials>();

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
              type="email"
              inputMode="email"
              placeholder="Email"
              name="email"
              required
            ></IonInput>
            <IonInput
              type="password"
              inputMode="text"
              placeholder="Passwort"
              name="password"
              required
            ></IonInput>
            <Link to={'#'}>Passwort vergessen?</Link>
            <div className="login__content__login__actions">
              <IonButton expand="block" color="primary">
                Anmelden
              </IonButton>
              <IonButton expand="block" color="primary" fill="outline">
                Neu Registrieren
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};
