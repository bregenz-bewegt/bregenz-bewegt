import { TitleBanner } from '@bregenz-bewegt/client-ui-components';
import { ForgotPasswordDto } from '@bregenz-bewegt/shared/types';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonPage,
  IonRow,
  IonText,
  useIonRouter,
} from '@ionic/react';
import { chevronBack, mailOpen } from 'ionicons/icons';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import './email-sent.scss';

/* eslint-disable-next-line */
export interface EmailSentProps {}

export const EmailSent: React.FC<EmailSentProps> = () => {
  const router = useIonRouter();
  const location = useLocation<ForgotPasswordDto>();

  useEffect(() => {
    const navigateBackToLogin = () => router.push('/login', 'none');
    if (!location?.state?.email) navigateBackToLogin();
  }, []);

  return (
    <IonPage className="email-sent">
      <IonContent className="email-sent__content" fullscreen>
        <div className="email-sent__flex-wrapper">
          <TitleBanner />
          <div className="email-sent__content__email-sent">
            <IonRow className="ion-justify-content-center">
              <IonIcon icon={mailOpen} size="large" />
              <IonText>
                <h2>E-Mail gesendet</h2>
              </IonText>
              <IonText>
                <p>
                  Eine E-Mail zum Zurücksetzen deines Passworts wurde an{' '}
                  {location?.state?.email ? (
                    <IonText className="sent-email-address" color="primary">
                      {location.state.email}
                    </IonText>
                  ) : (
                    'dich'
                  )}{' '}
                  versendet. Bitte überprüfe dein Postfach.
                </p>
              </IonText>
            </IonRow>
            <IonButton
              mode="ios"
              expand="block"
              color="primary"
              fill="outline"
              routerLink="/login"
              routerDirection="back"
            >
              <IonIcon icon={chevronBack} slot="start" />
              Zurück
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};
