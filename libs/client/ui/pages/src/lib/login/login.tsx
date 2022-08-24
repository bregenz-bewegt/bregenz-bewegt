import { IonPage, IonContent, IonText } from '@ionic/react';
import './login.scss';

/* eslint-disable-next-line */
export interface LoginProps {}

export const Login: React.FC = (props: LoginProps) => {
  return (
    <IonPage className="login">
      <IonContent className="login__content" fullscreen>
        <IonText className="login__title">
          <h1>
            Bregenz
            <br />
            Bewegt
          </h1>
        </IonText>
      </IonContent>
    </IonPage>
  );
};
