import { IonPage, IonContent } from '@ionic/react';
import './login.scss';

/* eslint-disable-next-line */
export interface LoginProps {}

export const Login: React.FC = (props: LoginProps) => {
  return (
    <IonPage>
      <IonContent fullscreen></IonContent>
    </IonPage>
  );
};
