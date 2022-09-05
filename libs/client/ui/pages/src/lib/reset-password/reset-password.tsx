import { Input, TitleBanner } from '@bregenz-bewegt/client-ui-components';
import { passwordResetSchema } from '@bregenz-bewegt/client/common/validation';
import {
  IonButton,
  IonContent,
  IonLabel,
  IonPage,
  IonSpinner,
} from '@ionic/react';
import { useFormik } from 'formik';
import './reset-password.scss';

/* eslint-disable-next-line */
export interface ResetPasswordProps {}

export const ResetPassword = (props: ResetPasswordProps) => {
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
              label="Passwort"
              placeholder="Passwort"
              value={reset.values.password}
              error={reset.touched.password ? reset.errors.password : undefined}
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
            <IonButton>
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
};

export default ResetPassword;
