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
} from '@ionic/react';
import { useFormik } from 'formik';
import { inject, observer } from 'mobx-react';
import { chevronBack } from 'ionicons/icons';
import './forgot-password.scss';
import { useLocation, useHistory } from 'react-router';
import { ForgotPasswordDto } from '@bregenz-bewegt/shared/types';

export interface ForgotPasswordProps {
  userStore?: UserStore;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = inject(
  userStore.storeKey
)(
  observer(({ userStore }) => {
    const router = useHistory();
    const location = useLocation<ForgotPasswordDto>();
    const forgot = useFormik({
      initialValues: {
        email: ((state: ForgotPasswordDto) => (state.email ? state.email : ''))(
          location.state ?? {}
        ),
      },
      validationSchema: forgotPasswordSchema,
      onSubmit: (values, { setSubmitting, setErrors }) => {
        userStore
          ?.forgotPassword({ email: values.email })
          .then(() => {
            router.push('/email-sent', {
              email: values.email,
            } as ForgotPasswordDto);
            setSubmitting(false);
          })
          .catch((error) => {
            setErrors(error.response.data);
            setSubmitting(false);
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
