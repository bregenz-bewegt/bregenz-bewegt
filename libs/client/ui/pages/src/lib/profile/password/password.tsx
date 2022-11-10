import React from 'react';
import { tabRoutes } from '@bregenz-bewegt/client-ui-router';
import { userStore, UserStore } from '@bregenz-bewegt/client/common/stores';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
} from '@ionic/react';
import { inject, observer } from 'mobx-react';
import { useFormik } from 'formik';
import { changePasswordSchema } from '@bregenz-bewegt/client/common/validation';
import { Input } from '@bregenz-bewegt/client-ui-components';
import './password.scss';

export interface PasswordProps {
  userStore?: UserStore;
}

export const Password: React.FC<PasswordProps> = inject(userStore.storeKey)(
  observer(({ userStore }) => {
    const passwordForm = useFormik({
      initialValues: {
        password: '',
        newPassword: '',
        newPasswordConfirmation: '',
      },
      validationSchema: changePasswordSchema,
      onSubmit: (values, { setSubmitting, setErrors }) => {
        //
      },
    });

    return (
      <IonPage className="profile-password">
        <IonHeader mode="ios">
          <IonToolbar>
            <IonButtons>
              <IonBackButton
                color="primary"
                defaultHref={tabRoutes.profile.route}
                text="Zurück"
              />
            </IonButtons>
            <IonTitle>Passwort ändern</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen scrollY={false}>
          <IonGrid>
            <IonRow className="password">
              <Input
                name="password"
                placeholder="Passwort"
                label="Passwort"
                value={passwordForm.values.password}
                error={
                  passwordForm.touched.password
                    ? passwordForm.errors.password
                    : undefined
                }
                onChange={passwordForm.handleChange}
                onBlur={passwordForm.handleBlur}
              />
            </IonRow>
            <IonRow>
              <Input
                name="newPassword"
                placeholder="Neues Passwort"
                label="Neues Passwort"
                value={passwordForm.values.newPassword}
                error={
                  passwordForm.touched.newPassword
                    ? passwordForm.errors.newPassword
                    : undefined
                }
                onChange={passwordForm.handleChange}
                onBlur={passwordForm.handleBlur}
              />
            </IonRow>
            <IonRow>
              <Input
                name="newPasswordConfirmation"
                placeholder="Neues Passwort bestätigen"
                label="Neues Passwort bestätigen"
                value={passwordForm.values.newPasswordConfirmation}
                error={
                  passwordForm.touched.newPasswordConfirmation
                    ? passwordForm.errors.newPasswordConfirmation
                    : undefined
                }
                onChange={passwordForm.handleChange}
                onBlur={passwordForm.handleBlur}
              />
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    );
  })
);
