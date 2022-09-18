import { Input, TitleBanner } from '@bregenz-bewegt/client-ui-components';
import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import { resetPasswordSchema } from '@bregenz-bewegt/client/common/validation';
import {
  IonButton,
  IonContent,
  IonLabel,
  IonPage,
  IonSpinner,
  IonText,
  useIonAlert,
  useIonToast,
} from '@ionic/react';
import { useFormik } from 'formik';
import { inject, observer } from 'mobx-react';
import { useEffect } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { closeCircleOutline } from 'ionicons/icons';
import './reset-password.scss';

interface MatchParams {
  token: string;
}

export interface ResetPasswordProps extends RouteComponentProps<MatchParams> {
  userStore?: UserStore;
}

export const ResetPassword = inject(userStore.storeKey)(
  observer(({ match }: ResetPasswordProps) => {
    const navigateBacktoLogin = () => history.push(`/login`);
    const history = useHistory();
    const [presentToast] = useIonToast();
    const [presentAlert] = useIonAlert();
    const reset = useFormik({
      initialValues: {
        password: '',
        passwordConfirmation: '',
      },
      validationSchema: resetPasswordSchema,
      onSubmit: (values, { setSubmitting }) => {
        userStore
          .resetPassword(values.password, match.params.token ?? '')
          .then(() => {
            setSubmitting(false);
            presentAlert({
              header: 'Passwort erfolgreich zurückgesetzt',
              message: `Bitte melde dich erneut an`,
              backdropDismiss: false,
              buttons: [
                {
                  text: 'OK',
                  handler: () => {
                    userStore.logout();
                  },
                },
              ],
            });
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
            navigateBacktoLogin();
          });
      },
    });

    useEffect(() => {
      if (!match.params.token) {
        navigateBacktoLogin();
      }
    }, [match.params.token]);

    return (
      <IonPage className="reset-password">
        <IonContent>
          <div className="reset-password__flex-wrapper">
            <TitleBanner />
            <div className="reset-password__content">
              <IonText>
                <h2>Passwort zurücksetzen</h2>
              </IonText>
              <Input
                name="password"
                type="password"
                inputMode="text"
                label="Neues Passwort"
                placeholder="Neues Passwort"
                value={reset.values.password}
                error={
                  reset.touched.password ? reset.errors.password : undefined
                }
                onChange={reset.handleChange}
                onBlur={reset.handleBlur}
              />
              <Input
                name="passwordConfirmation"
                type="password"
                inputMode="text"
                label="Passwort bestätigen"
                placeholder="Passwort bestätigen"
                value={reset.values.passwordConfirmation}
                error={
                  reset.touched.passwordConfirmation
                    ? reset.errors.passwordConfirmation
                    : undefined
                }
                onChange={reset.handleChange}
                onBlur={reset.handleBlur}
              />
              <IonButton
                mode="ios"
                expand="block"
                onClick={() => reset.submitForm()}
              >
                {reset.isSubmitting ? (
                  <IonLabel>
                    <IonSpinner name="crescent" />
                  </IonLabel>
                ) : (
                  'Passwort ändern'
                )}
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  })
);
