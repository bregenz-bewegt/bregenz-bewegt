import {
  IonPage,
  IonContent,
  IonText,
  IonButton,
  IonInput,
} from '@ionic/react';
import './login.scss';

/* eslint-disable-next-line */
export interface LoginProps {}

export const Login: React.FC = (props: LoginProps) => {
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

            <IonInput></IonInput>
            <IonInput></IonInput>
            <IonButton expand="block" color="primary">
              Anmelden
            </IonButton>
            <IonButton expand="block" color="primary" fill="outline">
              Neu Registrieren
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};
