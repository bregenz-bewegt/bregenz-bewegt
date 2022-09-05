import { IonContent, IonPage } from '@ionic/react';
import './reset-password.scss';

/* eslint-disable-next-line */
export interface ResetPasswordProps {}

export const ResetPassword = (props: ResetPasswordProps) => {
  return (
    <IonPage className="reset-password">
      <IonContent></IonContent>
    </IonPage>
  );
};

export default ResetPassword;
