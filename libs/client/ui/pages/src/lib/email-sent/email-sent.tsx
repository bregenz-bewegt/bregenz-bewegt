import { TitleBanner } from '@bregenz-bewegt/client-ui-components';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonPage,
  IonRow,
  IonText,
} from '@ionic/react';
import { chevronBack, mailOpen } from 'ionicons/icons';
import './email-sent.scss';

/* eslint-disable-next-line */
export interface EmailSentProps {}

export const EmailSent: React.FC<EmailSentProps> = () => {
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
                  Bitte überprüfe dein E-Mail Postfach{' '}
                  <IonText
                    className="sent-email-address"
                    color="primary"
                  ></IonText>{' '}
                  versandt wurde.
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
