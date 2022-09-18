import { TitleBanner, Input } from '@bregenz-bewegt/client-ui-components';
import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import { forgotPasswordSchema } from '@bregenz-bewegt/client/common/validation';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonLabel,
  IonPage,
  IonSpinner,
  IonText,
  useIonRouter,
  useIonToast,
} from '@ionic/react';
import { useFormik } from 'formik';
import { inject, observer } from 'mobx-react';
import { chevronBack, closeCircleOutline } from 'ionicons/icons';
import './forgot-password.scss';

export interface ForgotPasswordProps {
  userStore?: UserStore;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = inject(
  userStore.storeKey
)(
  observer(({ userStore }) => {
    const router = useIonRouter();
    const [presentToast] = useIonToast();
    const forgot = useFormik({
      initialValues: {
        email: '',
      },
      validationSchema: forgotPasswordSchema,
      onSubmit: (values, { setSubmitting }) => {
        userStore
          ?.forgotPassword({ email: values.email })
          .then((data) => {
            router.push('/email-sent');
            setSubmitting(false);
            console.log(data);
          })
          .catch(() => {
            setSubmitting(false);
            presentToast({
              message: 'Etwas ist schiefgelaufen',
              icon: closeCircleOutline,
              duration: 2000,
              position: 'top',
              mode: 'ios',
              color: 'danger',
            });
          });
      },
    });

    return (
      <IonPage className="forgot-password">
        <IonContent className="forgot-password__content" fullscreen>
          <div className="forgot-password__flex-wrapper">
            <TitleBanner />
            <div className="forgot-password__content__forgot-password">
              <IonText>
                <h2>Passwort vergessen</h2>
              </IonText>
              <Input
                name="email"
                type="email"
                inputMode="email"
                placeholder="Email"
                value={forgot.values.email}
                error={forgot.touched.email ? forgot.errors.email : undefined}
                onChange={forgot.handleChange}
                onBlur={forgot.handleBlur}
              ></Input>
              <IonButton
                mode="ios"
                expand="block"
                color="primary"
                onClick={() => forgot.submitForm()}
                disabled={forgot.isSubmitting}
                className="forgot-password__content__forgot-password__button"
              >
                {forgot.isSubmitting ? (
                  <IonLabel>
                    <IonSpinner name="crescent" />
                  </IonLabel>
                ) : (
                  'Passwort zurücksetzen'
                )}
              </IonButton>
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
  })
);
