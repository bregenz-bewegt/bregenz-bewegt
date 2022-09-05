import { Input, TitleBanner } from '@bregenz-bewegt/client-ui-components';
import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import { passwordResetSchema } from '@bregenz-bewegt/client/common/validation';
import {
  IonButton,
  IonContent,
  IonLabel,
  IonPage,
  IonSpinner,
} from '@ionic/react';
import { useFormik } from 'formik';
import { inject, observer } from 'mobx-react';
import { useEffect } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import './reset-password.scss';

interface MatchParams {
  token: string;
}

/* eslint-disable-next-line */
export interface ResetPasswordProps extends RouteComponentProps<MatchParams> {
  userStore?: UserStore;
}

export const ResetPassword = inject(userStore.storeKey)(
  observer(({ match }: ResetPasswordProps) => {
    const history = useHistory();
    const reset = useFormik({
      initialValues: {
        password: '',
        passwordConfirmation: '',
      },
      validationSchema: passwordResetSchema,
      onSubmit: (values, { setSubmitting }) => {
        console.log(values);
      },
    });

    useEffect(() => {
      const navigateBacktoLogin = () => history.push(`/login`);
      const resetToken = match.params.token;

      if (!resetToken) {
        navigateBacktoLogin();
      }
      userStore
        .resetPassword()
        .then((data) => {
          console.log(data);
        })
        .catch(() => navigateBacktoLogin());
    }, [match.params.token]);

    return (
      <IonPage className="reset-password">
        <IonContent>
          <div className="reset-password__flex-wrapper">
            <TitleBanner />
            <div className="reset-password__content">
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
              <IonButton expand="block">
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

export default ResetPassword;
